/**
 * Builds the static privacy/index.html for the Web App (Google Play's Privacy policy URL) from the app's
 * own Privacy Page: a server-side Vite build of src/privacyStatic.ts (scripts/ssrBuild.ts) renders the
 * Vue components in every language on the list, and the page gets the CSS that build produces,
 * inlined, so it needs no JavaScript. vite.config.ts calls this for the build and for the dev server.
 */
import { ssrBuild } from './ssrBuild.ts'

/**
 * The dark theme's rule in theme.css, whatever its quotes. The theme switch on <html> needs
 * JavaScript; this page follows the device's light or dark instead.
 */
const DARK_SELECTOR = /^:root\[data-theme=(['"]?)dark\1\]$/

/** What the copy below produces; the build fails without it, so the page never loses dark. */
const DARK_BY_DEVICE = /@media\s*\(prefers-color-scheme:\s*dark\)\s*\{\s*:root\s*\{/

/**
 * PostCSS plugin: copies the dark theme's tokens (src/styles/theme.css) into a
 * `prefers-color-scheme: dark` query, so a page with no theme set follows the device.
 */
const darkByDevicePlugin = {
  postcssPlugin: 'teach-clock-dark-by-device',
  Rule(rule: PostcssRule, { AtRule }: { AtRule: new (props: AtRuleProps) => PostcssNode }) {
    if (!DARK_SELECTOR.test(rule.selector.trim())) return
    const media = new AtRule({ name: 'media', params: '(prefers-color-scheme: dark)' })
    media.append(rule.clone({ selector: ':root' }))
    rule.after(media)
  },
}

// The few PostCSS shapes this plugin uses (postcss comes with Vite, not as a dependency of ours).
interface AtRuleProps {
  name: string
  params: string
}
interface PostcssNode {
  append(node: unknown): unknown
}
interface PostcssRule {
  selector: string
  clone(overrides: { selector: string }): unknown
  after(node: unknown): unknown
}

export interface PrivacyPage {
  html: string
  /** Files the page's CSS points to (the Nunito fonts), by their path under the site root. */
  assets: Map<string, string | Uint8Array>
}

/**
 * Renders privacy/index.html for a site served from `base`, with the app in `root`. `canonical` is
 * the page's public address, given only for the GitHub Pages build (batch 31).
 */
export async function buildPrivacyPage({
  root,
  base,
  canonical,
}: {
  root: string
  base: string
  canonical?: string
}): Promise<PrivacyPage> {
  return ssrBuild(
    { root, base, entry: 'src/privacyStatic.ts', postcssPlugins: [darkByDevicePlugin] },
    async ({ entry, css, assets }) => {
      if (!DARK_BY_DEVICE.test(css)) {
        throw new Error(
          "privacy/index.html: no device dark theme; is theme.css still :root[data-theme='dark']?",
        )
      }
      const { renderPrivacyPage } = entry as {
        renderPrivacyPage: (css: string, canonical?: string) => Promise<string>
      }
      return { html: await renderPrivacyPage(css, canonical), assets }
    },
  )
}
