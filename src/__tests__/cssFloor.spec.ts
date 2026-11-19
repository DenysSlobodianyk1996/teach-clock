// @vitest-environment node
/**
 * The game's CSS works on the oldest Chrome it supports (OLDEST_CHROME, src/config.ts): an Android
 * App on a never-updated system WebView. A Samsung S8 showed no border on the chosen Settings cards
 * and no clock in a Round, because those rules used CSS its WebView lacked (batch 22). Anything
 * newer than the floor must sit inside `@supports`, or, for a value without `var()`, follow a
 * declaration of the same property that the old WebView understands. A value with `var()` cannot
 * fall back that way: it is only checked when used, after it has already won.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse as parseSfc } from '@vue/compiler-sfc'
import postcss, { type AtRule, type Container, type Declaration } from 'postcss'
import { describe, expect, it } from 'vitest'
import { OLDEST_CHROME } from '@/config'

/** CSS newer than the floor, with the Chrome that added it. */
const NEWER = [
  { name: 'container units', chrome: 105, unit: /\d(cq[iwhb]|cqmin|cqmax)\b/ },
  { name: 'small/large/dynamic viewport units', chrome: 108, unit: /\d[sld]v(h|w|i|b|min|max)\b/ },
] as const
const HAS_CHROME = 105

/** The `@supports` rules around `node`. */
function supportsAround(node: Container | Declaration): string[] {
  const params: string[] = []
  for (let p = node.parent; p; p = p.parent as Container | undefined)
    if (p.type === 'atrule' && (p as AtRule).name === 'supports') params.push((p as AtRule).params)
  return params
}

/** Every use of CSS newer than OLDEST_CHROME in `css` that has no fallback, described. */
function newerThanFloor(css: string): string[] {
  const problems: string[] = []
  const root = postcss.parse(css)
  root.walkRules((rule) => {
    if (rule.selector.includes(':has(') && HAS_CHROME > OLDEST_CHROME) {
      if (!supportsAround(rule).some((p) => p.includes(':has(')))
        problems.push(`${rule.selector}: :has() (Chrome ${HAS_CHROME})`)
    }
  })
  root.walkDecls((decl) => {
    for (const feature of NEWER) {
      if (feature.chrome <= OLDEST_CHROME || !feature.unit.test(decl.value)) continue
      if (supportsAround(decl).some((p) => feature.unit.test(p))) continue
      const before = decl.parent!.nodes!.slice(0, decl.parent!.index(decl))
      const fallback = before.some(
        (n) => n.type === 'decl' && n.prop === decl.prop && !feature.unit.test(n.value),
      )
      if (fallback && !decl.prop.startsWith('--') && !decl.value.includes('var(')) continue
      const where =
        decl.parent!.type === 'rule' ? (decl.parent as { selector: string }).selector : ''
      problems.push(
        `${where} { ${decl.prop}: ${decl.value} }: ${feature.name} (Chrome ${feature.chrome})`,
      )
    }
  })
  return problems
}

/** Every stylesheet in src: `.css` files and each `<style>` of a `.vue` file. */
function stylesheets(): { file: string; css: string }[] {
  const src = fileURLToPath(new URL('..', import.meta.url))
  const sheets: { file: string; css: string }[] = []
  for (const file of readdirSync(src, { recursive: true }) as string[]) {
    if (file.includes('__tests__') || !/\.(css|vue)$/.test(file)) continue
    const text = readFileSync(join(src, file), 'utf8')
    if (file.endsWith('.css')) sheets.push({ file, css: text })
    if (file.endsWith('.vue'))
      for (const style of parseSfc(text).descriptor.styles)
        sheets.push({ file, css: style.content })
  }
  return sheets
}

describe(`CSS on Chrome ${OLDEST_CHROME}`, () => {
  it('finds the stylesheets', () => {
    expect(stylesheets().length).toBeGreaterThan(20)
  })

  it('uses nothing newer without a fallback', () => {
    const problems = stylesheets().flatMap(({ file, css }) =>
      newerThanFloor(css).map((p) => `${file}: ${p}`),
    )
    expect(problems).toEqual([])
  })
})

describe('newerThanFloor', () => {
  it('flags :has() outside @supports', () => {
    expect(newerThanFloor('.a:has(input:checked) { color: red }')).toHaveLength(1)
    expect(newerThanFloor('@supports selector(:has(a)) { .a:has(b) { color: red } }')).toEqual([])
  })

  it('flags new units unless a plain declaration comes first or @supports is around', () => {
    expect(newerThanFloor('.a { width: 41cqi }')).toHaveLength(1)
    expect(newerThanFloor('.a { width: 41vw; width: 41cqi }')).toEqual([])
    expect(newerThanFloor('@supports (width: 1cqw) { .a { width: 100cqw } }')).toEqual([])
    expect(newerThanFloor('.a { min-height: 100dvh }')).toHaveLength(1)
  })

  it('flags a fallback that cannot work: var() in the value, or a custom property', () => {
    expect(
      newerThanFloor('.a { width: calc(100vh - var(--x)); width: calc(100svh - var(--x)) }'),
    ).toHaveLength(1)
    expect(newerThanFloor(':root { --h: 100vh; --h: 100dvh }')).toHaveLength(1)
  })
})
