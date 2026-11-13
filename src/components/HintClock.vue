<script setup lang="ts">
import ClockFace from './ClockFace.vue'
import { formatClockTime, type ClockTime } from '@/game/clockTime'

/** The Hint for the Clock Time Games: a small clock with its Lit Place, and the digits. */
defineProps<{ time: ClockTime }>()
</script>

<template>
  <div class="correct">
    <ClockFace class="small-clock" :time="time" pointed />
    <div class="big-time">{{ formatClockTime(time) }}</div>
  </div>
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
