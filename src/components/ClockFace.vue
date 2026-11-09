<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { angleAt, numberPositions, pointedPlace } from '@/game/clockFace'
import { formatClockTime, handAngles, minutesBetween, type ClockTime } from '@/game/clockTime'

export type Hand = 'hour' | 'minute'

/**
 * An analogue clock showing a Clock Time. `rim="good"` turns the rim green, as after a right Answer
 * in Teach. `draggable` adds a grip to each hand tip: grabbing a hand and moving the pointer emits
 * `drag` with the pointer's angle, and the parent decides the new Clock Time. `pointed` lights up
 * where the hands point: the Minute Hand's tick and the Hour Hand's number, each in its hand's colour.
 */
const props = defineProps<{
  time: ClockTime
  rim?: 'good'
  draggable?: boolean
  /** The hands turn smoothly to a new time, as when "Set correct answer" moves them. */
  animate?: boolean
  /** Light up the minute tick and hour number the hands point to, as in Set Time and Drag Arrows. */
  pointed?: boolean
}>()
const emit = defineEmits<{ drag: [{ hand: Hand; angle: number }] }>()

const { t } = useI18n()

const numbers = numberPositions(66)

// The tick ring is one dashed circle: 60 short dashes, and 12 long ones on top.
const TICK_RADIUS = 84
const circumference = 2 * Math.PI * TICK_RADIUS
const tick = { dash: 1.2, gap: circumference / 60 - 1.2 }
const tick5 = { dash: 3, gap: circumference / 12 - 3 }
/** The lit tick runs a little past the others at both ends, so it shows beyond the minute grip. */
const LIT_TICK = { y1: -90, y2: -79 }

// Each hand: its line (tail past the pin to tip), its grip at the tip, and a bigger see-through
// circle around the grip, 48 units across: about 48 px to touch on a phone-sized clock. Both
// grips are the same small ring, so the number under one stays readable.
const GRIP_SIZE = 7
const HANDS = {
  hour: { line: 'c-hour', tail: 10, tip: -45, grip: 'h', reach: 24 },
  minute: { line: 'c-min', tail: 14, tip: -70, grip: 'm', reach: 24 },
} as const
/** Near the pin the pointer's direction swings wildly, so moves this close (in clock units) are ignored. */
const DEAD_ZONE = 20
const HAND_ORDER = ['hour', 'minute'] as const

// The angles the hands are drawn at. When animating they are not wrapped into 0–360: the clock
// winds the shorter way, both hands together like a real clock (from :55 to :05 the Minute Hand
// goes forward across 12), and a longer wind takes longer.
const angles = ref(handAngles(props.time))
const windSeconds = ref(0)
watch(
  () => props.time,
  (time, previous) => {
    if (!props.animate) {
      angles.value = handAngles(time)
      return
    }
    const minutes = minutesBetween(previous, time)
    angles.value = {
      hour: angles.value.hour + minutes * 0.5,
      minute: angles.value.minute + minutes * 6,
    }
    windSeconds.value = Math.min(0.6 + Math.abs(minutes) / 240, 2)
  },
)
const turn = (hand: Hand) => ({ transform: `rotate(${angles.value[hand]}deg)` })
const label = computed(() =>
  t(props.draggable ? 'app.clockDrag' : 'app.clockShows', { time: formatClockTime(props.time) }),
)

const svg = ref<SVGSVGElement>()
/** The drag in progress, with the clock's box measured once when the grip was grabbed. */
const dragging = ref<{ hand: Hand; pointerId: number; box: DOMRect } | null>(null)
/** The minute tick and hour number the hands point to, when `pointed`. */
const lit = computed(() => {
  if (!props.pointed) return null
  const { tick, number } = pointedPlace(angles.value)
  return {
    number: numbers[number - 1]!,
    tickStyle: { transform: `rotate(${tick * 6}deg)` },
  }
})
/** The numbers drawn plainly: all but the lit one, which goes on top of everything. */
const plainNumbers = computed(() => numbers.filter(({ n }) => n !== lit.value?.number.n))
/** The blur behind the lit tick and number; unique per clock, as several can share a page. */
const glowId = `glow-${useId()}`

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
    :class="[rim && `rim-${rim}`, { draggable, animate }]"
    :style="animate && { '--wind': `${windSeconds}s` }"
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
    <template v-if="lit">
      <defs>
        <filter
          :id="glowId"
          filterUnits="userSpaceOnUse"
          x="-100"
          y="-100"
          width="200"
          height="200"
        >
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>
      <!-- Under the hands, so the grips stay on top. The glow is a blurred copy behind it. -->
      <g class="c-lit-tick" data-lit-tick :style="lit.tickStyle">
        <line class="glow" :y1="LIT_TICK.y1" :y2="LIT_TICK.y2" :filter="`url(#${glowId})`" />
        <line :y1="LIT_TICK.y1" :y2="LIT_TICK.y2" />
      </g>
    </template>
    <!-- Without grips the numbers go under the hands; the thin hands leave them readable. -->
    <template v-if="!draggable">
      <text v-for="{ n, x, y } in plainNumbers" :key="n" class="c-num" :x="x" :y="y">{{ n }}</text>
    </template>
    <!-- The Minute Hand comes second, so it is on top where the hands cross. -->
    <g v-for="hand in HAND_ORDER" :key="hand" :data-hand="hand" :style="turn(hand)">
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
        :style="turn(hand)"
        @pointerdown="grab(hand, $event)"
      >
        <circle class="hit" :cy="HANDS[hand].tip" :r="HANDS[hand].reach" />
        <circle class="c-grip" :class="HANDS[hand].grip" :cy="HANDS[hand].tip" :r="GRIP_SIZE" />
      </g>
      <!-- With grips every number goes over them (at 3:15 the Minute Hand's grip sits on the 3).
           Numbers ignore the pointer, so a press on one still grabs the grip beneath. -->
      <text v-for="{ n, x, y } in plainNumbers" :key="n" class="c-num" :x="x" :y="y">{{ n }}</text>
    </template>
    <!-- The lit number goes on top of everything. -->
    <template v-if="lit">
      <text
        class="c-num c-lit-glow"
        :x="lit.number.x"
        :y="lit.number.y"
        :filter="`url(#${glowId})`"
        aria-hidden="true"
      >
        {{ lit.number.n }}
      </text>
      <text class="c-num lit" :x="lit.number.x" :y="lit.number.y">{{ lit.number.n }}</text>
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
.animate [data-hand],
.animate .grip {
  transition: transform var(--wind, 0.8s) ease-in-out;
}
@media (prefers-reduced-motion: reduce) {
  .animate [data-hand],
  .animate .grip {
    transition: none;
  }
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
