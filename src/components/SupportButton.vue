<script setup lang="ts">
import { onBeforeUnmount, ref, useId } from 'vue'
import { useI18n } from 'vue-i18n'

/**
 * Support Button: hold it for 2 s (pointer, Enter or Space) and `url` opens in a new tab.
 * A ring fills around the heart while held; letting go early cancels, so a stray tap opens nothing.
 */
const props = defineProps<{ url: string }>()

const HOLD_MS = 2000

const { t } = useI18n()
const hintId = useId()
const holding = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

function start() {
  if (holding.value) return
  holding.value = true
  timer = setTimeout(() => {
    timer = undefined
    window.open(props.url, '_blank', 'noopener')
    // The hold is used up: it stays done until the Player lets go and holds again.
  }, HOLD_MS)
}

function cancel() {
  clearTimeout(timer)
  timer = undefined
  holding.value = false
}

function onPointerDown(event: PointerEvent) {
  if (event.button !== 0) return
  start()
}

const HOLD_KEYS = ['Enter', ' ']

function onKeyDown(event: KeyboardEvent) {
  if (!HOLD_KEYS.includes(event.key)) return
  // Stop the native click on Enter/Space and the page scroll on Space.
  event.preventDefault()
  if (!event.repeat) start()
}

function onKeyUp(event: KeyboardEvent) {
  if (!HOLD_KEYS.includes(event.key)) return
  event.preventDefault()
  cancel()
}

onBeforeUnmount(cancel)
</script>

<template>
  <span class="support">
    <button
      class="hold"
      :class="{ holding }"
      type="button"
      :aria-label="t('support.button')"
      :aria-describedby="hintId"
      @pointerdown="onPointerDown"
      @pointerup="cancel"
      @pointerleave="cancel"
      @pointercancel="cancel"
      @keydown="onKeyDown"
      @keyup="onKeyUp"
      @blur="cancel"
      @contextmenu.prevent
    >
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle class="track" cx="32" cy="32" r="28" />
        <circle class="ring" cx="32" cy="32" r="28" pathLength="100" />
        <path
          class="heart"
          d="M32 45.5c-1 0-1.9-.4-2.6-1.1-5.2-4.7-10.4-9.1-10.4-14.9 0-4 3-7 6.8-7 2.6 0 4.8 1.4 6.2 3.6 1.4-2.2 3.6-3.6 6.2-3.6 3.8 0 6.8 3 6.8 7 0 5.8-5.2 10.2-10.4 14.9-.7.7-1.6 1.1-2.6 1.1z"
        />
      </svg>
    </button>
    <span :id="hintId" class="hint">{{ t('support.hold') }}</span>
  </span>
</template>

<style scoped>
.support {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.hold {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: var(--surface);
  box-shadow: 0 5px 0 rgba(0, 0, 0, 0.18);
  cursor: pointer;
  /* A long press must not select text, call up the context menu or scroll the page. */
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  touch-action: none;
}
svg {
  width: 64px;
  height: 64px;
  /* The ring starts at 12 o'clock and fills clockwise. */
  transform: rotate(-90deg);
}
.track,
.ring {
  fill: none;
  stroke-width: 5;
}
.track {
  stroke: var(--line);
}
.ring {
  stroke: var(--accent);
  stroke-linecap: round;
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  /* Letting go empties the ring quickly. */
  transition: stroke-dashoffset 0.2s ease-out;
}
.holding .ring {
  stroke-dashoffset: 0;
  /* Fills in exactly the hold time; ease-in-out, never past full (no bounce). */
  transition: stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.6, 1);
}
.heart {
  fill: var(--hour);
  transform: rotate(90deg);
  transform-origin: 32px 32px;
}
.hint {
  font-size: 14px;
  font-weight: 700;
  color: var(--muted);
}
@media (prefers-reduced-motion: reduce) {
  /* The ring still shows progress, filling at a steady pace, and resets at once. */
  .ring {
    transition: none;
  }
  .holding .ring {
    transition: stroke-dashoffset 2s linear;
  }
}
</style>
