import { describe, expect, it } from 'vitest'
import uk from '../uk'
import en from '../en'

/** Every leaf key as a dotted path, e.g. `round.submit`. */
function keys(messages: object, prefix = ''): string[] {
  return Object.entries(messages).flatMap(([key, value]) =>
    typeof value === 'object' && value !== null
      ? keys(value, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  )
}

describe('interface text', () => {
  it('has the same keys in Ukrainian and English', () => {
    expect(keys(en).sort()).toEqual(keys(uk).sort())
  })

  it('has no empty text', () => {
    const empty = [uk, en].flatMap((messages) =>
      keys(messages).filter(
        (path) =>
          path.split('.').reduce<unknown>((m, k) => (m as Record<string, unknown>)[k], messages) ===
          '',
      ),
    )
    expect(empty).toEqual([])
  })
})
