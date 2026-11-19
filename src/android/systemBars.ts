import { watch } from 'vue'
import { SystemBarsStyle, type SystemBars } from '@capacitor/core'
import type { Theme } from '@/stores/preferences'

export type SystemBarsStyler = Pick<typeof SystemBars, 'setStyle'>

/**
 * The Android App draws edge to edge, so the status and navigation bars lie on the theme's
 * background (batch 21). Their icons follow the theme, not the phone's dark mode: dark icons on
 * the light theme, light icons on the dark. Errors are ignored; the bars keep their last style.
 */
export function followTheme(theme: () => Theme, bars: SystemBarsStyler): void {
  watch(
    theme,
    (value) => {
      const style = value === 'dark' ? SystemBarsStyle.Dark : SystemBarsStyle.Light
      bars.setStyle({ style }).catch(() => {})
    },
    { immediate: true },
  )
}
