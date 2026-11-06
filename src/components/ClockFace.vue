<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { angleAt, HAND_GEOMETRY, numberPositions } from '@/game/clockFace'
import { formatClockTime, handAngles, minutesBetween, type ClockTime } from '@/game/clockTime'

export type Hand = 'hour' | 'minute'

/**
 * An analogue clock showing a Clock Time. `rim="good"` turns the rim green, as after a right Answer
 * in Teach. Each hand tapers to a point at its exact spot. `draggable` adds a grip behind each
 * tip: grabbing a hand and moving the pointer emits `drag` with the pointer's angle, and the
 * parent decides the new Clock Time. While a hand is dragged, the tick it lands on lights up.
 */
const props = defineProps<{
  time: ClockTime
  rim?: 'good'
  draggable?: boolean
  /** The hands turn smoothly to a new time, as when "Set correct answer" moves them. */
  animate?: boolean
}>()
const emit = defineEmits<{ drag: [{ hand: Hand; angle: number }] }>()

const { t } = useI18n()

const numbers = numberPositions(66)

// The tick ring is one dashed circle: 60 short dashes, and 12 long ones on top.
const TICK_RADIUS = 84
const circumference = 2 * Math.PI * TICK_RADIUS
const tick = { dash: 1.2, gap: circumference / 60 - 1.2 }
const tick5 = { dash: 3, gap: circumference / 12 - 3 }

// Each hand, drawn pointing at 12: its line (tail past the pin), a tip that tapers the hand to a
// point at its exact spot (as wide as the hand, so hand and tip read as one spear), its grip, and a
// bigger see-through circle around the grip, 48 units across: about 48 px to touch on a phone.
const HAND_STYLE = {
  hour: { line: 'c-hour', tail: 10, head: { length: 16, half: 5.5 }, grip: 'h', gripSize: 9 },
  minute: { line: 'c-min', tail: 14, head: { length: 18, half: 3.5 }, grip: 'm', gripSize: 11 },
} as const
const REACH = 24
const HANDS = Object.fromEntries(
  (['hour', 'minute'] as const).map((hand) => {
    const { tip, grip } = HAND_GEOMETRY[hand]
    const { head, ...style } = HAND_STYLE[hand]
    const base = -tip + head.length
    return [
      hand,
      {
        ...style,
        // The line's round cap ends where the taper starts; the tip's square back covers the cap's
        // corners, so the hand narrows to a point without a bump.
        lineEnd: base + head.half,
        head: [
          [0, -tip],
          [head.half, base],
          [head.half, base + head.half],
          [-head.half, base + head.half],
          [-head.half, base],
        ]
          .map((p) => p.join(','))
          .join(' '),
        gripAt: -grip,
      },
    ]
  }),
) as Record<
  Hand,
  {
    line: string
    tail: number
    lineEnd: number
    head: string
    grip: string
    gripSize: number
    gripAt: number
  }
>
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
/** The tick the dragged hand lands on: the snapped minute, or the hour's number (not the hand). */
const target = computed(() => {
  const hand = dragging.value?.hand
  if (!hand) return null
  const angle = hand === 'minute' ? props.time.minute * 6 : (props.time.hour % 12) * 30
  return { hand, style: { transform: `rotate(${angle}deg)` } }
})

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
    <g v-if="target" class="c-target" :class="target.hand" data-target-tick :style="target.style">
      <circle :cy="-TICK_RADIUS - 1" r="7" />
    </g>
    <text v-for="{ n, x, y } in numbers" :key="n" class="c-num" :x="x" :y="y">{{ n }}</text>
    <!-- The Minute Hand comes second, so it is on top where the hands cross. -->
    <g v-for="hand in HAND_ORDER" :key="hand" :data-hand="hand" :style="turn(hand)">
      <line :class="HANDS[hand].line" :y1="HANDS[hand].tail" :y2="HANDS[hand].lineEnd" />
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
        <circle class="hit" :cy="HANDS[hand].gripAt" :r="REACH" />
        <circle
          class="c-grip"
          :class="HANDS[hand].grip"
          :cy="HANDS[hand].gripAt"
          :r="HANDS[hand].gripSize"
        />
      </g>
    </template>
    <!-- Arrowheads go over the grips, so each grip sits behind its arrowhead. -->
    <g v-for="hand in HAND_ORDER" :key="hand" :data-head="hand" :style="turn(hand)">
      <polygon class="c-head" :class="hand" :points="HANDS[hand].head" />
    </g>
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
.animate [data-head],
.animate .grip {
  transition: transform var(--wind, 0.8s) ease-in-out;
}
@media (prefers-reduced-motion: reduce) {
  .animate [data-hand],
  .animate [data-head],
  .animate .grip {
    transition: none;
  }
}
.hit {
  fill: transparent;
}
[data-head] {
  pointer-events: none;
}
.c-grip.h {
  stroke: var(--hour);
}
.dragging .c-grip {
  fill: var(--accent);
}
</style>
