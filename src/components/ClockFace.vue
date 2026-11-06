<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { angleAt, numberPositions } from '@/game/clockFace'
import { formatClockTime, handAngles, type ClockTime } from '@/game/clockTime'

export type Hand = 'hour' | 'minute'

/**
 * An analogue clock showing a Clock Time. `rim="good"` turns the rim green, as after a right Answer
 * in Teach. `draggable` adds a grip to each hand tip: grabbing a hand and moving the pointer emits
 * `drag` with the pointer's angle, and the parent decides the new Clock Time.
 */
const props = defineProps<{ time: ClockTime; rim?: 'good'; draggable?: boolean }>()
const emit = defineEmits<{ drag: [{ hand: Hand; angle: number }] }>()

const { t } = useI18n()

const numbers = numberPositions(66)

// The tick ring is one dashed circle: 60 short dashes, and 12 long ones on top.
const TICK_RADIUS = 84
const circumference = 2 * Math.PI * TICK_RADIUS
const tick = { dash: 1.2, gap: circumference / 60 - 1.2 }
const tick5 = { dash: 3, gap: circumference / 12 - 3 }

// Each hand: its line (tail past the pin to tip), its grip at the tip, and a bigger see-through
// circle around the grip, 48 units across: about 48 px to touch on a phone-sized clock.
const HANDS = {
  hour: { line: 'c-hour', tail: 10, tip: -45, grip: 'h', gripSize: 9, reach: 24 },
  minute: { line: 'c-min', tail: 14, tip: -70, grip: 'm', gripSize: 11, reach: 24 },
} as const
/** Near the pin the pointer's direction swings wildly, so moves this close (in clock units) are ignored. */
const DEAD_ZONE = 20
const HAND_ORDER = ['hour', 'minute'] as const

const angles = computed(() => handAngles(props.time))
const label = computed(() =>
  t(props.draggable ? 'app.clockDrag' : 'app.clockShows', { time: formatClockTime(props.time) }),
)

const svg = ref<SVGSVGElement>()
/** The drag in progress, with the clock's box measured once when the grip was grabbed. */
const dragging = ref<{ hand: Hand; pointerId: number; box: DOMRect } | null>(null)

/** Only a grip starts a drag: a press on the line past the pin would turn the hand half a circle. */
function grab(hand: Hand, event: PointerEvent) {
  if (!svg.value || event.button !== 0) return
  event.preventDefault()
  dragging.value = { hand, pointerId: event.pointerId, box: svg.value.getBoundingClientRect() }
  // Keep getting moves when the finger slides off the clock. Older engines lack it.
  svg.value.setPointerCapture?.(event.pointerId)
}

function move(event: PointerEvent) {
  const drag = dragging.value
  if (!drag || event.pointerId !== drag.pointerId) return
  // A mouse let go outside the clock without us hearing it: the drag is over.
  if (event.pointerType === 'mouse' && event.buttons === 0) return release(event)
  const { box } = drag
  const x = event.clientX - (box.left + box.width / 2)
  const y = event.clientY - (box.top + box.height / 2)
  if (Math.hypot(x, y) < (DEAD_ZONE * box.width) / 200) return
  emit('drag', { hand: drag.hand, angle: angleAt(x, y) })
}

function release(event: PointerEvent) {
  if (dragging.value?.pointerId === event.pointerId) dragging.value = null
}
</script>

<template>
  <svg
    ref="svg"
    class="clock"
    :class="[rim && `rim-${rim}`, { draggable }]"
    viewBox="-100 -100 200 200"
    role="img"
    :aria-label="label"
    @pointermove="move"
    @pointerup="release"
    @pointercancel="release"
    @lostpointercapture="release"
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
    <!-- The Minute Hand comes second, so it is on top where the hands cross. -->
    <g
      v-for="hand in HAND_ORDER"
      :key="hand"
      :data-hand="hand"
      :transform="`rotate(${angles[hand]})`"
    >
      <line :class="HANDS[hand].line" :y1="HANDS[hand].tail" :y2="HANDS[hand].tip" />
    </g>
    <!-- Grips go over both hands, so the Hour Hand's grip stays reachable when the hands overlap. -->
    <template v-if="draggable">
      <g
        v-for="hand in HAND_ORDER"
        :key="hand"
        class="grip"
        :class="{ dragging: dragging?.hand === hand }"
        :data-grip="hand"
        :transform="`rotate(${angles[hand]})`"
        @pointerdown="grab(hand, $event)"
      >
        <circle class="hit" :cy="HANDS[hand].tip" :r="HANDS[hand].reach" />
        <circle
          class="c-grip"
          :class="HANDS[hand].grip"
          :cy="HANDS[hand].tip"
          :r="HANDS[hand].gripSize"
        />
      </g>
    </template>
    <circle class="c-pin" r="7" />
  </svg>
</template>

<style scoped>
.clock {
  display: block;
  overflow: visible;
  filter: drop-shadow(0 8px 0 rgba(0, 0, 0, 0.14));
}
.c-face {
  transition: stroke 0.2s;
}
.rim-good .c-face {
  stroke: var(--good);
}
.draggable {
  touch-action: none;
  user-select: none;
}
.grip {
  cursor: grab;
}
.draggable:has(.dragging),
.draggable:has(.dragging) * {
  cursor: grabbing;
}
.hit {
  fill: transparent;
}
.c-grip.h {
  stroke: var(--hour);
}
.dragging .c-grip {
  fill: var(--accent);
}
</style>
