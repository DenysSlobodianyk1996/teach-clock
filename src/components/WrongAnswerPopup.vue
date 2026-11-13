<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PopupDialog from './PopupDialog.vue'

/**
 * Teach, after a wrong Answer, in every Game: where the right place is (the default slot holds
 * the picture), one teaching line, and two buttons. Got it, Escape and the scrim emit `dismiss`,
 * and the Player tries again; Set correct answer emits `setCorrect`, and the Game puts it right.
 */
defineProps<{ line: string }>()
const emit = defineEmits<{ dismiss: []; setCorrect: [] }>()

const { t } = useI18n()
</script>

<template>
  <PopupDialog labelledby="wrong-title" describedby="wrong-why" wide @dismiss="emit('dismiss')">
    <h2 id="wrong-title">{{ t('teach.wrongTitle') }}</h2>
    <slot />
    <p id="wrong-why">{{ line }}</p>
    <div class="actions">
      <button class="btn" type="button" @click="emit('dismiss')">{{ t('teach.gotIt') }}</button>
      <button class="btn set-correct" type="button" @click="emit('setCorrect')">
        {{ t('teach.setCorrect') }}
      </button>
    </div>
  </PopupDialog>
</template>

<style scoped>
/* Side by side while they fit; on a narrow phone they wrap into a stack, Got it on top. */
.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  width: 100%;
}
.actions .btn {
  flex: 1 1 auto;
  padding: 0 22px;
  font-size: 19px;
}
/* Stands out on the popup in every theme, as Leave does in LeaveRoundDialog. */
.set-correct {
  background: var(--bg-deep);
  color: var(--text);
}
@media (--phone-upright) {
  .actions .btn {
    min-height: 54px;
  }
}
</style>
