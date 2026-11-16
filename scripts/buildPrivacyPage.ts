/**
 * Builds the static privacy.html for the Web App (Google Play's Privacy policy URL) from the app's
 * own Privacy Page: a server-side Vite build of src/privacyStatic.ts renders the Vue components in
 * Ukrainian and English, and the page gets the CSS that build produces, inlined, so it needs no
 * JavaScript. vite.config.ts calls this for the build and for the dev server.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { build, type Rollup } from 'vite'
import vue from '@vitejs/plugin-vue'
import { customMediaPlugin } from '../src/styles/media.ts'

/** The theme switch on <html> needs JavaScript; this page follows the device's light or dark. */
const DARK_SELECTOR = ":root[data-theme='dark']"

/**
 * PostCSS plugin: copies the dark theme's tokens (src/styles/theme.css) into a
 * `prefers-color-scheme: dark` query, so a page with no theme set follows the device.
 */
const darkByDevicePlugin = {
  postcssPlugin: 'teach-clock-dark-by-device',
  Rule(rule: PostcssRule, { AtRule }: { AtRule: new (props: AtRuleProps) => PostcssNode }) {
    if (rule.selector !== DARK_SELECTOR) return
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

/** Renders privacy.html for a site served from `base`, with the app in `root`. */
export async function buildPrivacyPage({
  root,
  base,
}: {
  root: string
  base: string
}): Promise<PrivacyPage> {
  const outDir = path.join(root, 'node_modules/.cache/teach-clock-privacy')
  const result = await build({
    configFile: false,
    root,
    base,
    mode: 'production',
    logLevel: 'warn',
    plugins: [vue()],
    css: { postcss: { plugins: [customMediaPlugin, darkByDevicePlugin] } },
    resolve: { alias: { '@': path.join(root, 'src') } },
    build: {
      ssr: 'src/privacyStatic.ts',
      ssrEmitAssets: true,
      cssCodeSplit: false,
      write: false,
      outDir,
    },
  })
  const outputs = (Array.isArray(result) ? result : [result]) as Rollup.RollupOutput[]
  const files = outputs.flatMap((out) => out.output)

  let css = ''
  const assets = new Map<string, string | Uint8Array>()
  for (const file of files) {
    if (file.type === 'chunk') {
      await mkdir(path.dirname(path.join(outDir, file.fileName)), { recursive: true })
      await writeFile(path.join(outDir, file.fileName), file.code)
    } else if (file.fileName.endsWith('.css')) {
      css += String(file.source)
    } else {
      assets.set(file.fileName, file.source)
    }
  }
  if (!css.includes('prefers-color-scheme')) throw new Error('privacy.html: no dark theme in CSS')

  const entry = files.find((file) => file.type === 'chunk' && file.isEntry)
  if (!entry) throw new Error('privacy.html: the build has no entry')
  // A fresh URL each time, so the dev server picks up edits.
  const url = `${pathToFileURL(path.join(outDir, entry.fileName)).href}?t=${Date.now()}`
  const { renderPrivacyPage } = (await import(url)) as {
    renderPrivacyPage: (css: string) => Promise<string>
  }
  return { html: await renderPrivacyPage(css), assets }
}
