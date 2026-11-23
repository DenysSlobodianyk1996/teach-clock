<script setup lang="ts">
/**
 * The header's language button and the dropdown of the language list it opens (batch 28), as a
 * menu button: the arrows, Home and End move, Enter or Space chooses, Escape closes, and focus goes
 * back to the button. A clear layer behind the menu takes a tap outside, so that tap closes the
 * menu and changes nothing on the screen. While open it is in `openPopups`, so the Android back
 * button closes it too.
 */
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import HeaderButton from './HeaderButton.vue'
import { trackPopup } from './openPopups'
import { LANGUAGES, languageOf, type Locale } from '@/i18n/locales'
import { usePreferencesStore } from '@/stores/preferences'

const { t } = useI18n()
const preferences = usePreferencesStore()

const open = ref(false)
const button = ref<InstanceType<typeof HeaderButton>>()
const menu = ref<HTMLElement>()
const current = computed(() => languageOf(preferences.locale))
const label = computed(() => t('header.languageNow', { language: current.value.name }))

let untrack: (() => void) | undefined

const rows = () => [...(menu.value?.querySelectorAll('button') ?? [])]

async function openMenu(focusAt: 'current' | 'last' = 'current') {
  if (open.value) return
  open.value = true
  untrack = trackPopup(close)
  await nextTick()
  const all = rows()
  const at = LANGUAGES.findIndex((language) => language.code === preferences.locale)
  all[focusAt === 'last' ? all.length - 1 : at]?.focus()
}

function close() {
  if (!open.value) return
  open.value = false
  untrack?.()
  untrack = undefined
  button.value?.focus()
}

function choose(locale: Locale) {
  preferences.locale = locale
  close()
}

function move(event: KeyboardEvent) {
  const all = rows()
  const at = all.indexOf(document.activeElement as HTMLButtonElement)
  const next = {
    ArrowDown: (at + 1) % all.length,
    ArrowUp: (at - 1 + all.length) % all.length,
    Home: 0,
    End: all.length - 1,
  }[event.key]
  if (next === undefined) return
  event.preventDefault()
  all[next]?.focus()
}

onBeforeUnmount(() => untrack?.())
</script>

<template>
  <div class="language-menu">
    <HeaderButton
      ref="button"
      circle
      class="language"
      :label="label"
      aria-haspopup="menu"
      :aria-expanded="open"
      :aria-controls="open ? 'language-menu' : undefined"
      @click="openMenu()"
      @keydown.down.prevent="openMenu()"
      @keydown.up.prevent="openMenu('last')"
    >
      {{ current.key }}
    </HeaderButton>
    <template v-if="open">
      <div class="outside" @click="close" />
      <div
        id="language-menu"
        ref="menu"
        class="menu"
        role="menu"
        :aria-label="label"
        @keydown="move"
        @keydown.esc="close"
        @keydown.tab="close"
      >
        <button
          v-for="language in LANGUAGES"
          :key="language.code"
          class="row"
          type="button"
          role="menuitemradio"
          tabindex="-1"
          :aria-checked="language.code === preferences.locale"
          @click="choose(language.code)"
        >
          <span class="key">{{ language.key }}</span
          >{{ ' ' }}<span class="name" :lang="language.code">{{ language.name }}</span>
          <svg
            v-if="language.code === preferences.locale"
            class="tick"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.language-menu {
  position: relative;
}
.language {
  font-size: 15px;
}
.outside {
  position: fixed;
  inset: 0;
  z-index: 4;
}
/* Below the button, its right edge on the button's. Never past the bottom system bar: a very short
   screen scrolls the list inside. */
.menu {
  position: absolute;
  z-index: 5;
  top: calc(100% + 6px);
  right: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 184px;
  max-height: calc(var(--safe-height) - var(--header-height) - 12px);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 6px;
  border: 2px solid var(--line);
  border-radius: 20px;
  background: var(--pop);
  color: var(--pop-ink);
  box-shadow: var(--shadow);
}
.row {
  display: flex;
  flex: none;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 46px;
  padding: 0 10px;
  border: 0;
  border-radius: 14px;
  background: transparent;
  color: inherit;
  font:
    700 16px 'Nunito',
    sans-serif;
  text-align: left;
  cursor: pointer;
}
.row:hover,
.row:focus {
  background: var(--surface-2);
}
.row:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: -3px;
}
.key {
  flex: none;
  width: 28px;
  font-weight: 900;
}
.name {
  flex: 1;
  min-width: 0;
}
.tick {
  flex: none;
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
