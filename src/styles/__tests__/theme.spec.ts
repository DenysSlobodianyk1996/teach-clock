// @vitest-environment node
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { THEMES, type Theme } from '@/stores/preferences'

// Read from disk: Vitest swaps CSS imports, even `?raw`, for empty text.
const css = readFileSync(new URL('../theme.css', import.meta.url), 'utf8')

/** Custom properties declared in the rule for `selector`. */
function tokensOf(selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`)
  if (start < 0) throw new Error(`No rule for ${selector}`)
  const body = css.slice(start, css.indexOf('}', start))
  return Object.fromEntries([...body.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2]]))
}

/** The tokens a theme ends up with: middle on `:root`, the others override it. */
function tokens(theme: Theme): Record<string, string> {
  const root = tokensOf(':root')
  return theme === 'middle' ? root : { ...root, ...tokensOf(`:root[data-theme='${theme}']`) }
}

/** WCAG relative luminance of a `#rrggbb` colour. */
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi! + 0.05) / (lo! + 0.05)
}

/** Text colour on background, as the screens use them. */
const TEXT_PAIRS: [text: string, background: string][] = [
  ['--text', '--bg'],
  ['--text', '--bg-deep'],
  ['--text', '--surface'],
  ['--text', '--surface-2'],
  ['--muted', '--bg'],
  ['--muted', '--bg-deep'],
  ['--muted', '--surface'],
  ['--muted', '--surface-2'],
  ['--good-text', '--surface'],
  ['--accent-ink', '--accent'],
  ['--pop-ink', '--pop'],
  ['--num', '--face'],
  ['--tile-ink', '--tile'],
]

describe('theme contrast', () => {
  it('checks real numbers', () => {
    // Worked example: black on white is 21:1.
    expect(contrast('#000000', '#ffffff')).toBeCloseTo(21)
  })

  it.each(THEMES)('text meets WCAG AA (4.5:1) in the %s theme', (theme) => {
    const t = tokens(theme)
    const failing = TEXT_PAIRS.map(([fg, bg]) => ({
      pair: `${fg} on ${bg}`,
      ratio: Math.round(contrast(t[fg]!, t[bg]!) * 100) / 100,
    })).filter(({ ratio }) => ratio < 4.5)
    expect(failing).toEqual([])
  })
})
