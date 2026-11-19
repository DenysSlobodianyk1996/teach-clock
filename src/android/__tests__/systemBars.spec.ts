import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { SystemBarsStyle } from '@capacitor/core'
import type { Theme } from '@/stores/preferences'
import { followTheme, type SystemBarsStyler } from '../systemBars'

describe('followTheme: the system bars’ icons follow the theme', () => {
  it('dark icons on the light theme, light icons on the dark, at start and on every switch', async () => {
    const theme = ref<Theme>('light')
    const bars = { setStyle: vi.fn<SystemBarsStyler['setStyle']>().mockResolvedValue(undefined) }
    followTheme(() => theme.value, bars)
    expect(bars.setStyle).toHaveBeenLastCalledWith({ style: SystemBarsStyle.Light })

    theme.value = 'dark'
    await nextTick()
    expect(bars.setStyle).toHaveBeenLastCalledWith({ style: SystemBarsStyle.Dark })

    theme.value = 'light'
    await nextTick()
    expect(bars.setStyle).toHaveBeenLastCalledWith({ style: SystemBarsStyle.Light })
    expect(bars.setStyle).toHaveBeenCalledTimes(3)
  })

  it('ignores a call that fails', async () => {
    const bars = {
      setStyle: vi.fn<SystemBarsStyler['setStyle']>().mockRejectedValue(new Error('no plugin')),
    }
    expect(() => followTheme(() => 'dark', bars)).not.toThrow()
    await Promise.resolve()
  })
})
