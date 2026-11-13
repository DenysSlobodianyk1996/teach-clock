<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * A modal popup on a scrim. Its first button, or the one marked `data-autofocus`, gets the focus
 * (given back on close), Tab stays
 * inside, and Escape or a click on the scrim emits `dismiss`. The content is the slot; label it
 * with `labelledby`. `wide` gives room for two long buttons side by side.
 */
defineProps<{ labelledby: string; describedby?: string; wide?: boolean }>()
const emit = defineEmits<{ dismiss: [] }>()

const popup = ref<HTMLElement>()

const buttons = () => [...(popup.value?.querySelectorAll('button') ?? [])]

let focusedBefore: Element | null = null

onMounted(() => {
  focusedBefore = document.activeElement
  const first = popup.value?.querySelector<HTMLElement>('button[data-autofocus]') ?? buttons()[0]
  first?.focus()
})
onBeforeUnmount(() => {
  if (focusedBefore instanceof HTMLElement && focusedBefore.isConnected) focusedBefore.focus()
})

function trapTab(event: KeyboardEvent) {
  const all = buttons()
  const at = all.indexOf(document.activeElement as HTMLButtonElement)
  const next = (at + (event.shiftKey ? -1 : 1) + all.length) % all.length
  all[next]?.focus()
  event.preventDefault()
}
</script>

<template>
  <div class="scrim" @click.self="emit('dismiss')">
    <div
      ref="popup"
      class="popup"
      :class="{ wide }"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="labelledby"
      :aria-describedby="describedby"
      @keydown.esc="emit('dismiss')"
      @keydown.tab="trapTab"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.scrim {
  position: fixed;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: var(--scrim);
}
.popup {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  width: min(460px, 100%);
  padding: 32px 40px;
  border-radius: 32px;
  background: var(--pop);
  color: var(--pop-ink);
  box-shadow: var(--shadow);
  text-align: center;
}
.popup.wide {
  width: min(600px, 100%);
}
.popup :slotted(h2) {
  margin: 0;
  font-size: 28px;
  font-weight: 900;
}
.popup :slotted(p) {
  margin: 0;
  font-size: 17px;
}
@media (--phone-upright) {
  .popup {
    padding: 28px 22px;
  }
}
</style>
