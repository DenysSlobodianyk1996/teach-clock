<script setup lang="ts">
import { FACE_VIEW as VIEW, numberPositions, SLOT_RADIUS } from '@/game/clockFace'
import { tileValue } from '@/game/dragNumbers'
import type { NumbersGame } from '@/game/round'

/**
 * A read-only drag Game face, as in the Summary: each slot shows the tile on it, or an empty
 * ring. `marked` slots get a red ring, for tiles that are not where they belong.
 */
const props = withDefaults(
  defineProps<{
    /** Says what each tile shows (`tileValue`). Numbers below are slot ids 1–12. */
    game: NumbersGame
    /** What each slot holds: index N−1 is the slot where N belongs. */
    slots: readonly (number | null)[]
    marked?: readonly number[]
    /** Numbers drawn in green, as the misplaced ones on the correct face. */
    good?: readonly number[]
    label: string
  }>(),
  { marked: () => [], good: () => [] },
)

const places = numberPositions(SLOT_RADIUS)
/** What tile N shows. */
const value = (n: number) => tileValue(props.game, n)
</script>

<template>
  <svg
    class="clock number-face"
    :viewBox="`${-VIEW / 2} ${-VIEW / 2} ${VIEW} ${VIEW}`"
    role="img"
    :aria-label="label"
  >
    <circle class="c-face" r="94" />
    <circle class="c-tick5" r="84" stroke-dasharray="3 40.982" stroke-dashoffset="1.5" />
    <template v-for="{ n, x, y } in places" :key="n">
      <g
        v-if="slots[n - 1] !== null"
        :data-slot="n"
        :class="{ marked: marked.includes(n), good: good.includes(slots[n - 1]!) }"
      >
        <circle class="c-tile" :cx="x" :cy="y" r="15" />
        <text class="c-tile-num" :x="x" :y="y">{{ value(slots[n - 1]!) }}</text>
      </g>
      <circle v-else class="c-slot" :cx="x" :cy="y" r="14" />
    </template>
    <circle class="c-pin" r="7" />
  </svg>
</template>

<style scoped>
.number-face {
  display: block;
  overflow: visible;
}
.good .c-tile {
  fill: var(--good);
}
.marked .c-tile {
  stroke: var(--bad);
  stroke-width: 4;
}
</style>
