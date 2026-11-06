<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { FACE_VIEW as VIEW, numberPositions, SLOT_RADIUS, slotAt } from '@/game/clockFace'

/**
 * Drag Numbers: an empty clock face with 12 slots, and the tray of numbers still to place. Drag a
 * tile onto a slot with a finger or the mouse, or tap a tile and then a slot (also by keyboard).
 * The board only reports `drop`; the parent decides what the drop does.
 */
const props = defineProps<{
  /** What each slot holds: index N−1 is the slot where N belongs. */
  slots: readonly (number | null)[]
  tray: readonly number[]
  /** A tray number to ring, as after a wrong drop in Teach. */
  marked?: number | null
  disabled?: boolean
}>()
const emit = defineEmits<{ drop: [number: number, slot: number] }>()

const { t } = useI18n()

const places = numberPositions(SLOT_RADIUS)
/** A press that moves less than this (px) is a tap, not a drag. */
const TAP_SLOP = 6

const face = ref<SVGSVGElement>()
/** Tapped tile waiting for a slot. */
const selected = ref<number | null>(null)
/** The tile being dragged, where the pointer is, and the slot under it. */
const held = ref<{
  number: number
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

function slotUnder(clientX: number, clientY: number): number | null {
  if (!face.value) return null
  const box = face.value.getBoundingClientRect()
  const scale = VIEW / box.width
  const slot = slotAt(
    (clientX - (box.left + box.width / 2)) * scale,
    (clientY - (box.top + box.height / 2)) * scale,
  )
  return slot !== null && props.slots[slot - 1] === null ? slot : null
}

function press(number: number, event: PointerEvent) {
  // A drag that ended away from its tile got no click to clear this.
  dragged = false
  if (props.disabled || event.button !== 0) return
  held.value = {
    number,
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
    h.slot = slotUnder(h.x, h.y)
  }
}

function release(event: PointerEvent) {
  const h = held.value
  if (!h || event.pointerId !== h.pointerId) return
  held.value = null
  if (!h.moved) return
  dragged = true
  // Lifting the finger anywhere but a free slot puts the tile back on the tray.
  const slot = slotUnder(event.clientX, event.clientY)
  if (slot !== null && !props.disabled) emit('drop', h.number, slot)
}

function cancel(event: PointerEvent) {
  if (held.value?.pointerId === event.pointerId) held.value = null
}

/** A tap (or Enter/Space) on a tray tile picks it up, or puts it down again. */
function tapTile(number: number, event: MouseEvent) {
  const afterDrag = dragged
  dragged = false
  // Enter and Space click with `detail` 0; only a pointer click can be the tail of a drag.
  if (afterDrag && event.detail > 0) return
  if (props.disabled) return
  selected.value = selected.value === number ? null : number
}

function tapSlot(slot: number) {
  if (props.disabled || selected.value === null || props.slots[slot - 1] !== null) return
  const number = selected.value
  selected.value = null
  emit('drop', number, slot)
}
</script>

<template>
  <section class="board">
    <div class="clock-side">
      <!-- Above the face: the parent's toast. -->
      <slot name="clock" />
      <div class="clock-wrap">
        <svg
          ref="face"
          class="clock number-face"
          :viewBox="`${-VIEW / 2} ${-VIEW / 2} ${VIEW} ${VIEW}`"
          role="group"
          :aria-label="faceLabel"
        >
          <circle class="c-face" r="94" />
          <circle class="c-tick5" r="84" stroke-dasharray="3 40.982" stroke-dashoffset="1.5" />
          <template v-for="{ n, x, y } in places" :key="n">
            <g v-if="slots[n - 1] !== null" class="placed" :data-slot="n">
              <circle class="c-tile" :cx="x" :cy="y" r="15" />
              <text class="c-tile-num" :x="x" :y="y">{{ slots[n - 1] }}</text>
            </g>
            <g
              v-else
              class="slot"
              :class="{ target: held?.slot === n, ready: selected !== null }"
              :data-slot="n"
              role="button"
              :tabindex="disabled ? -1 : 0"
              :aria-label="t('numbers.slot', { n })"
              @click="tapSlot(n)"
              @keydown.enter.prevent="tapSlot(n)"
              @keydown.space.prevent="tapSlot(n)"
            >
              <circle class="hit" :cx="x" :cy="y" r="20" />
              <circle class="c-slot" :class="{ target: held?.slot === n }" :cx="x" :cy="y" r="14" />
            </g>
          </template>
          <circle class="c-pin" r="7" />
        </svg>
      </div>
    </div>
    <div class="tray-side">
      <slot name="heading" />

      <div class="tray" role="group" :aria-label="t('numbers.tray')">
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
          {{ n }}
        </button>
      </div>
      <slot />
    </div>
  </section>

  <Teleport to="body">
    <div
      v-if="held?.moved"
      class="tile lifted"
      aria-hidden="true"
      :style="{ left: `${held.x}px`, top: `${held.y}px` }"
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
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  padding: 18px;
  border-radius: 28px;
  background: var(--bg-deep);
}
.tile {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: var(--tile);
  color: var(--tile-ink);
  font:
    900 28px 'Nunito',
    sans-serif;
  box-shadow: 0 5px 0 rgba(0, 0, 0, 0.16);
  cursor: grab;
  touch-action: none;
  user-select: none;
}
.tile.ghost {
  color: transparent;
  background: transparent;
  box-shadow: none;
  border: 3px dashed var(--line);
}
.tile.selected {
  background: var(--accent);
  color: var(--accent-ink);
  transform: translateY(-4px);
}
.tile.marked {
  outline: 4px solid var(--hour);
  outline-offset: 3px;
}
.tile:disabled {
  cursor: default;
}
.tile.lifted {
  position: fixed;
  z-index: 10;
  translate: -50% -50%;
  pointer-events: none;
  background: var(--accent);
  color: var(--accent-ink);
  transform: rotate(-8deg) scale(1.12);
  box-shadow:
    0 14px 0 rgba(0, 0, 0, 0.12),
    0 22px 30px rgba(0, 0, 0, 0.3);
  cursor: grabbing;
}
@media (max-width: 600px), (max-height: 500px) {
  .board {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 14px;
    align-content: start;
  }
  .number-face {
    width: min(260px, 64vw);
  }
  .tray {
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 8px;
    padding: 12px;
  }
  .tile {
    width: 46px;
    height: 46px;
    font-size: 22px;
  }
}
@media (max-height: 500px) and (min-width: 601px) {
  .board {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
