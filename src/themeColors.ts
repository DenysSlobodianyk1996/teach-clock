/**
 * Each theme's background, `--bg` in src/styles/theme.css, for the places that can't read CSS:
 * the PWA manifest, the pre-paint script in index.html, the app icons, the Android splash and the
 * static Privacy Page. A test keeps these equal to theme.css.
 */
export const THEME_BG = {
  light: '#f5efe3',
  dark: '#121a24',
} as const
