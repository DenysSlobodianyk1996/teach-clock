<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { formatClockTime, type ClockTime } from '@/game/clockTime'

/**
 * The Drag Arrows answer side: the target Clock Time, which hand is which, and Submit.
 * Submit is always enabled: untouched hands are just a wrong Answer.
 */
defineProps<{ target: ClockTime; disabled?: boolean }>()
const emit = defineEmits<{ submit: [] }>()

const { t } = useI18n()
</script>

<template>
  <div class="target">{{ formatClockTime(target) }}</div>
  <ul class="legend">
    <li>
      <svg viewBox="0 0 60 20" aria-hidden="true">
        <line class="c-hour" x1="8" y1="10" x2="40" y2="10" />
      </svg>
      {{ t('round.hourHand') }}
    </li>
    <li>
      <svg viewBox="0 0 60 20" aria-hidden="true">
        <line class="c-min" x1="6" y1="10" x2="56" y2="10" />
      </svg>
      {{ t('round.minuteHand') }}
    </li>
  </ul>
  <button class="btn submit" type="button" :disabled="disabled" @click="emit('submit')">
    {{ t('round.submit') }}
  </button>
</template>

<style scoped>
.target {
  padding: 18px 46px;
  border-radius: 28px;
  background: var(--face);
  color: var(--num);
  font:
    900 96px 'Nunito',
    sans-serif;
  line-height: 1;
}
.legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 17px;
  color: var(--muted);
}
.legend li {
  display: flex;
  align-items: center;
  gap: 12px;
}
.legend svg {
  width: 60px;
  height: 20px;
}
.submit {
  width: min(340px, 100%);
}
@media (--phone) {
  .target {
    padding: 10px 30px;
    font-size: 56px;
  }
  .legend {
    gap: 6px;
    font-size: 15px;
  }
  .legend svg {
    width: 44px;
  }
}
</style>
