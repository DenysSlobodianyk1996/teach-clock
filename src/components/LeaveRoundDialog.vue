<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

/** "Leave this Round?" Keep playing is the safe, focused choice; Escape and the scrim also keep playing. */
const emit = defineEmits<{ stay: []; leave: [] }>()

const { t } = useI18n()
const stayButton = ref<HTMLButtonElement>()

onMounted(() => stayButton.value?.focus())

/** Keeps Tab inside the dialog's two buttons. */
function trapTab(event: KeyboardEvent) {
  const buttons = [...(event.currentTarget as HTMLElement).querySelectorAll('button')]
  const at = buttons.indexOf(document.activeElement as HTMLButtonElement)
  const next = (at + (event.shiftKey ? -1 : 1) + buttons.length) % buttons.length
  buttons[next]?.focus()
  event.preventDefault()
}
</script>

<template>
  <div class="scrim" @click.self="emit('stay')">
    <div
      class="popup"
      role="dialog"
      aria-modal="true"
      aria-labelledby="leave-title"
      aria-describedby="leave-body"
      @keydown.esc="emit('stay')"
      @keydown.tab="trapTab"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M14 4h5v16h-5" />
        <path d="M9 8l-4 4 4 4" />
        <path d="M5 12h11" />
      </svg>
      <h2 id="leave-title">{{ t('leave.title') }}</h2>
      <p id="leave-body">{{ t('leave.body') }}</p>
      <div class="actions">
        <button ref="stayButton" class="btn" type="button" @click="emit('stay')">
          {{ t('leave.stay') }}
        </button>
        <button class="btn leave" type="button" @click="emit('leave')">
          {{ t('leave.leave') }}
        </button>
      </div>
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
.popup svg {
  width: 48px;
  height: 48px;
  color: var(--hour);
}
h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 900;
}
p {
  margin: 0;
  font-size: 17px;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
}
.leave {
  background: var(--bg-deep);
  color: var(--text);
}
@media (max-width: 600px) {
  .popup {
    padding: 28px 22px;
  }
}
</style>
