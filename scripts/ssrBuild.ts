/**
 * A server-side Vite build of one of the app's static entries (src/privacyStatic.ts,
 * src/welcomeStatic.ts): the app's own Vue components rendered to HTML at build time, with the CSS
 * that build produces, so the page needs no JavaScript. scripts/buildPrivacyPage.ts and
 * scripts/buildWelcomePage.ts use it.
 */
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { build, type Rollup } from 'vite'
import vue from '@vitejs/plugin-vue'
import { customMediaPlugin } from '../src/styles/media.ts'
import { OLDEST_CHROME } from '../src/config.ts'

export interface SsrBuilt {
  /** The entry module, loaded: its exports render the page. */
  entry: unknown
  /** Every stylesheet the entry's components need, in one. */
  css: string
  /** Files the CSS points to (the Nunito fonts), by their path under the site root. */
  assets: Map<string, string | Uint8Array>
}

export interface SsrBuildOptions {
  /** The app's folder. */
  root: string
  /** Where the site is served from (Vite's `base`), for the assets' URLs. */
  base: string
  /** The server-side entry, relative to `root`. */
  entry: string
  /** PostCSS plugins after the app's own (src/styles/media.ts). */
  postcssPlugins?: unknown[]
}

/**
 * Builds `entry` for the server and hands it to `render` while its files exist; they go once the
 * page is rendered.
 */
export async function ssrBuild<R>(
  options: SsrBuildOptions,
  render: (built: SsrBuilt) => Promise<R>,
): Promise<R> {
  // Its own folder per build, inside the project so the chunks find vue in node_modules; parallel
  // builds (dev server, tests) never share files.
  const cache = path.join(options.root, 'node_modules/.cache/teach-clock-ssr')
  await mkdir(cache, { recursive: true })
  const outDir = await mkdtemp(path.join(cache, 'build-'))
  try {
    return await render(await buildInto(outDir, options))
  } finally {
    await rm(outDir, { recursive: true, force: true })
  }
}

async function buildInto(
  outDir: string,
  { root, base, entry, postcssPlugins = [] }: SsrBuildOptions,
): Promise<SsrBuilt> {
  const result = await build({
    configFile: false,
    root,
    base,
    mode: 'production',
    logLevel: 'warn',
    plugins: [vue()],
    css: { postcss: { plugins: [customMediaPlugin, ...(postcssPlugins as [])] } },
    resolve: { alias: { '@': path.join(root, 'src') } },
    build: {
      ssr: entry,
      ssrEmitAssets: true,
      cssCodeSplit: false,
      // The same browsers as the app's CSS (vite.config.ts), old Android WebViews included.
      cssTarget: [`chrome${OLDEST_CHROME}`, 'edge107', 'firefox104', 'safari16'],
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

  const main = files.find((file) => file.type === 'chunk' && file.isEntry)
  if (!main) throw new Error(`${entry}: the build has no entry`)
  // Each build has its own folder, so its URL is new and the dev server picks up edits.
  const loaded: unknown = await import(pathToFileURL(path.join(outDir, main.fileName)).href)
  return { entry: loaded, css, assets }
}
