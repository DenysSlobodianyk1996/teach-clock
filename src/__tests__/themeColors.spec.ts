// @vitest-environment node
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { THEME_BG } from '@/themeColors'

// Read from disk: Vitest swaps CSS imports, even `?raw`, for empty text.
const css = readFileSync(new URL('../styles/theme.css', import.meta.url), 'utf8')

/** The `--bg` declared in the rule for `selector`. */
function bgOf(selector: string): string {
  const start = css.indexOf(`${selector} {`)
  if (start < 0) throw new Error(`No rule for ${selector}`)
  const body = css.slice(start, css.indexOf('}', start))
  return body.match(/--bg:\s*([^;]+);/)![1]!.trim()
}

describe('Theme backgrounds', () => {
  it('light is --bg on :root in theme.css', () => {
    expect(THEME_BG.light).toBe(bgOf(':root'))
  })

  it("dark is --bg under [data-theme='dark'] in theme.css", () => {
    expect(THEME_BG.dark).toBe(bgOf(":root[data-theme='dark']"))
  })
})
