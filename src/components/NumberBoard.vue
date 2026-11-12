<script setup lang="ts">
import { computed, ref } from 'vue'
import { useElementSize } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { FACE_VIEW as VIEW, numberPositions, SLOT_RADIUS, slotAt } from '@/game/clockFace'

/**
 * Drag Numbers: an empty clock face with 12 slots, and the tray of numbers still to place. Drag a
 * tile onto a slot with a finger or the mouse, or tap a tile and then a slot (also by keyboard).
 * With `movable` (Test), numbers on the face can be picked up too: dropped on another slot, or
 * back on the tray. The board only reports `drop` and `toTray`; the parent decides what they do.
 */
const props = defineProps<{
  /** What each slot holds: index N−1 is the slot where N belongs. */
  slots: readonly (number | null)[]
  tray: readonly number[]
  /** A tray number to ring, as after a wrong drop in Teach. */
  marked?: number | null
  /** Numbers on the face can be moved, and dropped on a taken slot. */
  movable?: boolean
  disabled?: boolean
  /** A hint shows above the face: on a phone the face shrinks to keep the tray on screen. */
  hinted?: boolean
}>()
const emit = defineEmits<{ drop: [number: number, slot: number]; toTray: [number: number] }>()

const { t } = useI18n()

const places = numberPositions(SLOT_RADIUS)
/** A placed number's radius in face units. Tray and dragged numbers are drawn the same size. */
const TILE_RADIUS = 15
/** A press that moves less than this (px) is a tap, not a drag. */
const TAP_SLOP = 6

const face = ref<SVGSVGElement>()
// Every number is as big as a placed one, so it follows the clock: smaller on a phone.
const { width: faceWidth } = useElementSize(face)
const numberSize = computed(() =>
  faceWidth.value ? { '--number-size': `${(faceWidth.value * 2 * TILE_RADIUS) / VIEW}px` } : {},
)
const trayBox = ref<HTMLElement>()
/** Tapped tile waiting for a slot. */
const selected = ref<number | null>(null)
/** The tile being dragged, where the pointer is, and the slot under it. */
const held = ref<{
  number: number
  /** The slot it was picked up from, or null from the tray. */
  from: number | null
  pointerId: number
  startX: number
  startY: number
  x: number
  y: number
  moved: boolean
  slot: number | null
} | null>(null)
/** A drag just ended, so a click on the tile that follows is not a tap. */
let dragged = false

const placed = computed(() => props.slots.filter((n) => n !== null).length)
const faceLabel = computed(() => t('numbers.face', { n: placed.value }))

/** Where N sits on the face, or null when it is on the tray. */
const slotOf = (number: number) => props.slots.indexOf(number) + 1 || null

/** A slot `number` can be dropped on: a free one, or in Test any other. */
function takes(slot: number, number: number) {
  return props.slots[slot - 1] === null || (props.movable && slotOf(number) !== slot)
}

function slotUnder(number: number, clientX: number, clientY: number): number | null {
  if (!face.value) return null
  const box = face.value.getBoundingClientRect()
  const scale = VIEW / box.width
  const slot = slotAt(
    (clientX - (box.left + box.width / 2)) * scale,
    (clientY - (box.top + box.height / 2)) * scale,
  )
  return slot !== null && takes(slot, number) ? slot : null
}

function overTray(clientX: number, clientY: number) {
  const box = trayBox.value?.getBoundingClientRect()
  return (
    !!box &&
    clientX >= box.left &&
    clientX <= box.right &&
    clientY >= box.top &&
    clientY <= box.bottom
  )
}

function press(number: number, event: PointerEvent) {
  // A drag that ended away from its tile got no click to clear this.
  dragged = false
  if (props.disabled || event.button !== 0) return
  held.value = {
    number,
    from: slotOf(number),
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    x: event.clientX,
    y: event.clientY,
    moved: false,
    slot: null,
  }
  // Keep getting moves when the finger leaves the tile. Older engines lack it.
  ;(event.currentTarget as Element).setPointerCapture?.(event.pointerId)
}

function move(event: PointerEvent) {
  const h = held.value
  if (!h || event.pointerId !== h.pointerId) return
  h.x = event.clientX
  h.y = event.clientY
  if (Math.hypot(h.x - h.startX, h.y - h.startY) > TAP_SLOP) h.moved = true
  if (h.moved) {
    selected.value = null
    h.slot = slotUnder(h.number, h.x, h.y)
  }
}

function release(event: PointerEvent) {
  const h = held.value
  if (!h || event.pointerId !== h.pointerId) return
  held.value = null
  if (!h.moved) return
  dragged = true
  if (props.disabled) return
  // The drop lands on the slot highlighted by the last move, not one worked out again from where
  // the finger lifts: a small slip as it lifts must not lose the drop. With no slot highlighted,
  // the tile goes back where it came from, or to the tray when let go over it.
  const slot = h.slot !== null && takes(h.slot, h.number) ? h.slot : null
  if (slot !== null) emit('drop', h.number, slot)
  else if (h.from !== null && overTray(event.clientX, event.clientY)) emit('toTray', h.number)
}

function cancel(event: PointerEvent) {
  if (held.value?.pointerId === event.pointerId) held.value = null
}

/** A tap (or Enter/Space) on a tray tile picks it up, or puts it down again. */
function tapTile(number: number, event: UIEvent) {
  const afterDrag = dragged
  dragged = false
  // Enter and Space click with `detail` 0; only a pointer click can be the tail of a drag.
  if (afterDrag && event.detail > 0) return
  if (props.disabled) return
  selected.value = selected.value === number ? null : number
}

function tapSlot(slot: number) {
  const number = selected.value
  if (props.disabled || number === null || !takes(slot, number)) return
  selected.value = null
  emit('drop', number, slot)
}

/** Test: a number on the face can be picked up and moved. */
const canHold = (slot: number) => !!props.movable && props.slots[slot - 1] !== null
/** Empty slots take numbers; in Test the numbers on the face can be picked up too. */
const interactive = (slot: number) => props.slots[slot - 1] === null || canHold(slot)

function slotClasses(slot: number) {
  const number = props.slots[slot - 1]
  // A picked or dragged number lights every free slot it can go to.
  const ready = selected.value !== null || !!held.value?.moved
  if (number === null) return ['slot', { target: held.value?.slot === slot, ready }]
  return [
    'placed',
    {
      movable: canHold(slot),
      selected: selected.value === number,
      ghost: held.value?.moved && held.value.number === number,
      target: held.value?.slot === slot,
    },
  ]
}

function slotLabel(slot: number) {
  const number = props.slots[slot - 1]
  if (number === null) return t('numbers.slot', { n: slot })
  return canHold(slot) ? t('numbers.placedTile', { number, n: slot }) : undefined
}

/** A tap, Enter or Space on a slot. */
function activate(slot: number, event: UIEvent) {
  const number = props.slots[slot - 1]
  if (number == null) tapSlot(slot)
  else if (canHold(slot)) tapPlaced(number, slot, event)
}

/** Test: Delete or Backspace on a number on the face takes it back to the tray. */
function sendBack(slot: number) {
  const number = props.slots[slot - 1]
  if (props.disabled || !canHold(slot) || number == null) return
  selected.value = null
  emit('toTray', number)
}

/** Test: a tap on a number on the face takes the picked-up one there, or picks this one up. */
function tapPlaced(number: number, slot: number, event: UIEvent) {
  if (selected.value !== null && selected.value !== number && !dragged) tapSlot(slot)
  else tapTile(number, event)
}

/** Test: a tap on the tray's free space takes a picked-up face number back there. */
function tapTray() {
  const number = selected.value
  if (props.disabled || number === null || slotOf(number) === null) return
  selected.value = null
  emit('toTray', number)
}
</script>

<template>
  <section class="board" :class="{ test: movable, hinted }" :style="numberSize">
    <div class="clock-side">
      <!-- Above the face: the parent's toast. -->
      <slot name="clock" />
      <div class="clock-wrap">
        <svg
          ref="face"
          class="clock number-face"
          :class="{ movable }"
          :viewBox="`${-VIEW / 2} ${-VIEW / 2} ${VIEW} ${VIEW}`"
          role="group"
          :aria-label="faceLabel"
        >
          <circle class="c-face" r="94" />
          <circle class="c-tick5" r="84" stroke-dasharray="3 40.982" stroke-dashoffset="1.5" />
          <!-- One element per slot, whatever it holds, so keyboard focus stays put through a move. -->
          <g
            v-for="{ n, x, y } in places"
            :key="n"
            :class="slotClasses(n)"
            :data-slot="n"
            :role="interactive(n) ? 'button' : undefined"
            :tabindex="interactive(n) ? (disabled ? -1 : 0) : undefined"
            :aria-label="slotLabel(n)"
            :aria-pressed="canHold(n) ? selected === slots[n - 1] : undefined"
            :aria-keyshortcuts="canHold(n) ? 'Delete' : undefined"
            @pointerdown="canHold(n) && press(slots[n - 1]!, $event)"
            @pointermove="move"
            @pointerup="release"
            @pointercancel="cancel"
            @lostpointercapture="cancel"
            @click="activate(n, $event)"
            @keydown.enter.prevent="activate(n, $event)"
            @keydown.space.prevent="activate(n, $event)"
            @keydown.delete.prevent="sendBack(n)"
          >
            <circle v-if="interactive(n)" class="hit" :cx="x" :cy="y" r="20" />
            <template v-if="slots[n - 1] !== null">
              <circle class="c-tile" :cx="x" :cy="y" :r="TILE_RADIUS" />
              <text class="c-tile-num" :x="x" :y="y">{{ slots[n - 1] }}</text>
            </template>
            <circle
              v-else
              class="c-slot"
              :class="{ target: held?.slot === n }"
              :cx="x"
              :cy="y"
              r="14"
            />
          </g>
          <circle class="c-pin" r="7" />
        </svg>
      </div>
    </div>
    <div class="tray-side">
      <slot name="heading" />

      <div
        ref="trayBox"
        class="tray"
        :class="{ empty: !tray.length }"
        role="group"
        :aria-label="t('numbers.tray')"
        @click.self="tapTray"
      >
        <!-- The held tile stays in the tray as a ghost: it keeps the pointer while the copy follows. -->
        <button
          v-for="n in tray"
          :key="n"
          class="tile"
          :class="{
            selected: selected === n,
            marked: marked === n,
            ghost: held?.moved && held.number === n,
          }"
          type="button"
          :data-number="n"
          :aria-pressed="selected === n"
          :disabled="disabled"
          @pointerdown="press(n, $event)"
          @pointermove="move"
          @pointerup="release"
          @pointercancel="cancel"
          @lostpointercapture="cancel"
          @click="tapTile(n, $event)"
        >
          <!-- The button is the 48 px tap area; the disc inside is the number's visible size. -->
          <span class="disc">{{ n }}</span>
        </button>
      </div>
      <slot />
    </div>
  </section>

  <Teleport to="body">
    <div
      v-if="held?.moved"
      class="disc lifted"
      aria-hidden="true"
      :style="[numberSize, { left: `${held.x}px`, top: `${held.y}px` }]"
    >
      {{ held.number }}
    </div>
  </Teleport>
</template>

<style scoped>
.board {
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  align-items: center;
}
.clock-side,
.tray-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}
.clock-wrap {
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
}
.number-face {
  width: min(100%, 41cqi);
  height: auto;
  aspect-ratio: 1;
  display: block;
  overflow: visible;
  filter: drop-shadow(0 8px 0 rgba(0, 0, 0, 0.14));
}
.slot {
  cursor: pointer;
  outline: none;
}
.slot .hit {
  fill: transparent;
}
.slot.ready .c-slot {
  stroke: var(--accent);
}
.c-slot.target {
  stroke: var(--accent);
  stroke-width: 4;
  stroke-dasharray: none;
  fill: rgba(242, 184, 75, 0.18);
}
.slot:focus-visible .c-slot {
  stroke: var(--accent);
  stroke-width: 4;
}
.tray {
  display: grid;
  grid-template-columns: repeat(4, max-content);
  gap: 12px;
  padding: 18px;
  border-radius: 28px;
  background: var(--bg-deep);
}
/* The tap area: at least 48 px square, whatever size the number is drawn. */
.tile {
  display: flex;
  align-items: center;
  justify-content: center;
  width: max(48px, var(--number-size, 48px));
  height: max(48px, var(--number-size, 48px));
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: none;
  cursor: grab;
  touch-action: none;
  user-select: none;
}
/* The number as seen: the same size on the tray, under the pointer and on the face. */
.disc {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: var(--number-size, 48px);
  height: var(--number-size, 48px);
  border-radius: 50%;
  background: var(--tile);
  color: var(--tile-ink);
  /* As in a placed number: 17 face units of text on a 30-unit tile. */
  font:
    900 calc(var(--number-size, 48px) * 0.57) 'Nunito',
    sans-serif;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.16);
}
.tile.ghost .disc {
  color: transparent;
  background: transparent;
  box-shadow: none;
  border: 3px dashed var(--line);
}
.tile.selected .disc {
  background: var(--accent);
  color: var(--accent-ink);
  transform: translateY(-4px);
}
.placed.movable {
  cursor: grab;
  outline: none;
}
.placed .hit {
  fill: transparent;
}
.placed.selected .c-tile,
.placed:focus-visible .c-tile {
  stroke: var(--text);
  stroke-width: 3;
}
.placed.target .c-tile {
  stroke: var(--accent-ink);
  stroke-width: 3;
}
.placed.ghost {
  opacity: 0.3;
}
.movable {
  touch-action: none;
  user-select: none;
}
/* An empty tray stays a drop target in Test. */
.tray.empty {
  min-width: 200px;
  min-height: 64px;
}
.tile.marked .disc {
  outline: 4px solid var(--hour);
  outline-offset: 3px;
}
.tile:disabled {
  cursor: default;
}
.disc.lifted {
  position: fixed;
  z-index: 10;
  translate: -50% -50%;
  pointer-events: none;
  background: var(--accent);
  color: var(--accent-ink);
  /* `rotate`, not `transform: rotate()`: the production CSS minifier folds `translate` into a
     later `transform` and drops it, which left the number off-centre under the pointer. */
  rotate: -8deg;
  box-shadow:
    0 14px 0 rgba(0, 0, 0, 0.12),
    0 22px 30px rgba(0, 0, 0, 0.3);
  cursor: grabbing;
}
@media (--phone) {
  .board {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 8px;
    align-content: start;
  }
  .clock-side,
  .tray-side {
    gap: 8px;
  }
  /*
   * The face takes the height the rest of the screen leaves, up to the full width. Each number is
   * the height of everything else on a 360 × 720 phone (see RoundView); with a hint showing, or in
   * Test where Submit can appear, the face leaves more room.
   */
  .number-face {
    width: clamp(200px, 100svh - 346px, 100vw - 40px);
  }
  .board.test .number-face {
    width: clamp(200px, 100svh - 366px, 100vw - 40px);
  }
  .board.hinted .number-face {
    width: clamp(200px, 100svh - 388px, 100vw - 40px);
  }
  /* Six 48 px tap areas side by side still fit a 360 px wide phone. */
  .tray {
    grid-template-columns: repeat(6, max-content);
    gap: 2px;
    padding: 8px;
  }
}
@media (--phone-sideways) {
  .board {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
