<script lang="ts">
import { numberPositions } from '@/game/clockFace'

const BADGE_RADIUS = 40
/** The same for every face, so worked out once. */
const places = numberPositions(BADGE_RADIUS)
</script>

<script setup lang="ts">
/**
 * Drag Minutes: the Hour Badges, the hour 1–12 in a soft circle towards the centre from each
 * slot. Part of the face, not a Hint: drawn under the tiles, never catching a pointer or a drop.
 * `large`: for a face drawn small (a Summary pair), the badges grow so their digits stay readable.
 */
defineProps<{ large?: boolean }>()
</script>

<template>
  <g class="hour-badges" :class="{ large }" aria-hidden="true" pointer-events="none">
    <g v-for="{ n, x, y } in places" :key="n" class="hour-badge">
      <circle class="c-badge" :cx="x" :cy="y" :r="large ? 10 : 8.5" />
      <text class="c-badge-num" :x="x" :y="y">{{ n }}</text>
    </g>
  </g>
</template>
