/**
 * The app's shared breakpoints, written in styles as custom media, such as `@media (--phone)`.
 * Vite expands them at build time with the small PostCSS plugin below (see vite.config.ts), so
 * every screen switches layout at the same point and none can drift apart. Restart the dev server
 * after changing them.
 */
/** Phone held upright, or any window as narrow as one or taller than wide (an upright tablet). */
const upright = '(max-width: 768px), (orientation: portrait)'

export const customMedia: Record<string, string> = {
  '--phone-upright': upright,
  /** The stacked phone layout: upright, or a phone held sideways (500px tall or less). */
  '--phone': `${upright}, (max-height: 500px)`,
  /** A sideways phone wide enough to put the clock and the answer side by side. */
  '--phone-sideways': '(max-height: 500px) and (min-width: 601px)',
}

/** Replaces each `(--name)` in a media query with its definition from `customMedia`. */
export function expandCustomMedia(params: string): string {
  return params.replace(/\((--[\w-]+)\)/g, (_, name: string) => {
    const query = customMedia[name]
    if (query === undefined) throw new Error(`Unknown custom media ${name}`)
    return query
  })
}

/** PostCSS plugin: expands custom media in every `@media` rule. */
export const customMediaPlugin = {
  postcssPlugin: 'teach-clock-custom-media',
  AtRule: {
    media(rule: { params: string }) {
      rule.params = expandCustomMedia(rule.params)
    },
  },
}
