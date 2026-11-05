import uk from '../src/i18n/uk.ts'

/** Every dotted key in the messages, such as `teach.right`. */
type Key<T> = {
  [K in keyof T & string]: T[K] extends string ? K : `${K}.${Key<T[K]>}`
}[keyof T & string]

/**
 * Interface text by key, as the app shows it (Ukrainian), with `{name}` filled from `params`.
 * Browser tests use this, never literal text.
 */
export function t(key: Key<typeof uk>, params: Record<string, string | number> = {}): string {
  const message = key
    .split('.')
    .reduce<unknown>((node, part) => (node as Record<string, unknown>)[part], uk)
  if (typeof message !== 'string') throw new Error(`No message "${key}"`)
  return message.replace(/\{(\w+)\}/g, (_, name: string) => {
    if (!(name in params)) throw new Error(`Message "${key}" needs {${name}}`)
    return String(params[name])
  })
}

/** Matches an accessible name that starts with `text`, such as a choice card's title. */
export function startingWith(text: string): RegExp {
  return new RegExp(`^${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)
}
