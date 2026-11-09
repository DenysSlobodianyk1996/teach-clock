<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ClockFace from './ClockFace.vue'
import PopupDialog from './PopupDialog.vue'
import { formatClockTime, type ClockTime } from '@/game/clockTime'
import type { Mistake } from '@/game/mistakes'

/** Teach, after a wrong Answer: the correct Clock Time as digits and a small clock, and one teaching line. */
defineProps<{ answer: ClockTime; mistake: Mistake }>()
const emit = defineEmits<{ close: [] }>()

const { t } = useI18n()
</script>

<template>
  <PopupDialog labelledby="wrong-title" describedby="wrong-why" @dismiss="emit('close')">
    <h2 id="wrong-title">{{ t('teach.wrongTitle') }}</h2>
    <div class="correct">
      <ClockFace class="small-clock" :time="answer" />
      <div class="big-time">{{ formatClockTime(answer) }}</div>
    </div>
    <p id="wrong-why">{{ t(`teach.mistakes.${mistake.kind}`, mistake.params) }}</p>
    <button class="btn got-it" type="button" @click="emit('close')">{{ t('teach.gotIt') }}</button>
  </PopupDialog>
</template>

<style scoped>
.correct {
  display: flex;
  align-items: center;
  gap: 28px;
}
.small-clock {
  width: 150px;
  height: 150px;
}
.big-time {
  font:
    900 64px 'Nunito',
    sans-serif;
  line-height: 1;
}
.got-it {
  min-width: 220px;
}
@media (--phone-upright) {
  .correct {
    gap: 18px;
  }
  .small-clock {
    width: 110px;
    height: 110px;
  }
  .big-time {
    font-size: 48px;
  }
}
</style>
