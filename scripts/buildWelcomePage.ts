/**
 * Renders the prerendered English Welcome for the GitHub Pages build's index.html (batch 31): a
 * server-side Vite build of src/welcomeStatic.ts (scripts/ssrBuild.ts). vite.config.ts puts the
 * markup in #app and the CSS in a <style> after the app's stylesheet: the page already loads the
 * app's own styles (src/styles/base.css), so the CSS is only the components' own.
 */
import { ssrBuild } from './ssrBuild.ts'

export interface WelcomePage {
  /** The markup for #app. */
  html: string
  /** The CSS of Welcome and the frame around it. */
  css: string
}

/** Renders the Welcome for a site served from `base`, with the app in `root`. */
export async function buildWelcomePage({
  root,
  base,
}: {
  root: string
  base: string
}): Promise<WelcomePage> {
  return ssrBuild({ root, base, entry: 'src/welcomeStatic.ts' }, async ({ entry, css }) => {
    const { renderWelcome } = entry as { renderWelcome: (base: string) => Promise<string> }
    return { html: await renderWelcome(base), css }
  })
}
