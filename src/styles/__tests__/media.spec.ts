import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { describe, expect, it } from 'vitest'
import { expandCustomMedia } from '../media'

describe('expandCustomMedia', () => {
  it('turns the phone breakpoint into: 768px wide or less, taller than wide, or a sideways phone', () => {
    expect(expandCustomMedia('(--phone)')).toBe(
      '(max-width: 768px), (orientation: portrait), (max-height: 500px)',
    )
  })

  it('keeps the upright phone breakpoint without the sideways-phone part', () => {
    expect(expandCustomMedia('(--phone-upright)')).toBe(
      '(max-width: 768px), (orientation: portrait)',
    )
  })

  it('keeps sideways phones wider than 600px as today', () => {
    expect(expandCustomMedia('(--phone-sideways)')).toBe(
      '(max-height: 500px) and (min-width: 601px)',
    )
  })

  it('leaves ordinary media queries alone', () => {
    expect(expandCustomMedia('(min-width: 1100px) and (min-height: 860px)')).toBe(
      '(min-width: 1100px) and (min-height: 860px)',
    )
  })

  it('refuses an unknown name, so a typo cannot silently drop a layout', () => {
    expect(() => expandCustomMedia('(--phnoe)')).toThrow(/--phnoe/)
  })
})

describe('the phone breakpoint lives in one place', () => {
  // Vitest runs from the project root.
  const src = join(process.cwd(), 'src')
  const styled = (readdirSync(src, { recursive: true }) as string[]).filter((f) =>
    /\.(vue|css)$/.test(f),
  )

  it('no screen writes its own phone width', () => {
    const stray = styled.filter((f) =>
      /max-width:\s*600px|min-width:\s*601px|max-height:\s*500px/.test(
        readFileSync(join(src, f), 'utf8'),
      ),
    )
    expect(stray).toEqual([])
  })
})
