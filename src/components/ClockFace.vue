<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { numberPositions } from '@/game/clockFace'
import { formatClockTime, handAngles, type ClockTime } from '@/game/clockTime'

/** A read-only analogue clock showing a Clock Time. Draggable hands and empty slots come later. */
const props = defineProps<{ time: ClockTime }>()

const { t } = useI18n()

const numbers = numberPositions(66)

// The tick ring is one dashed circle: 60 short dashes, and 12 long ones on top.
const TICK_RADIUS = 84
const circumference = 2 * Math.PI * TICK_RADIUS
const tick = { dash: 1.2, gap: circumference / 60 - 1.2 }
const tick5 = { dash: 3, gap: circumference / 12 - 3 }

const angles = computed(() => handAngles(props.time))
</script>

<template>
  <svg
    class="clock"
    viewBox="-100 -100 200 200"
    role="img"
    :aria-label="t('app.clockShows', { time: formatClockTime(time) })"
  >
    <circle class="c-face" r="94" />
    <circle
      class="c-tick"
      :r="TICK_RADIUS"
      :stroke-dasharray="`${tick.dash} ${tick.gap}`"
      :stroke-dashoffset="tick.dash / 2"
    />
    <circle
      class="c-tick5"
      :r="TICK_RADIUS"
      :stroke-dasharray="`${tick5.dash} ${tick5.gap}`"
      :stroke-dashoffset="tick5.dash / 2"
    />
    <text v-for="{ n, x, y } in numbers" :key="n" class="c-num" :x="x" :y="y">{{ n }}</text>
    <line class="c-hour" data-hand="hour" y1="10" y2="-45" :transform="`rotate(${angles.hour})`" />
    <line
      class="c-min"
      data-hand="minute"
      y1="14"
      y2="-70"
      :transform="`rotate(${angles.minute})`"
    />
    <circle class="c-pin" r="7" />
  </svg>
</template>

<style scoped>
.clock {
  display: block;
  overflow: visible;
  filter: drop-shadow(0 8px 0 rgba(0, 0, 0, 0.14));
}
</style>
