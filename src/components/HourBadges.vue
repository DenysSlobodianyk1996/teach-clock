<script setup lang="ts">
import { numberPositions } from '@/game/clockFace'

/**
 * Drag Minutes: the Hour Badges, the hour 1–12 in a soft circle towards the centre from each
 * slot. Part of the face, not a Hint: drawn under the tiles, never catching a pointer or a drop.
 */
const BADGE_RADIUS = 40
const places = numberPositions(BADGE_RADIUS)
</script>

<template>
  <g class="hour-badges" aria-hidden="true" pointer-events="none">
    <g v-for="{ n, x, y } in places" :key="n" class="hour-badge">
      <circle class="c-badge" :cx="x" :cy="y" r="8.5" />
      <text class="c-badge-num" :x="x" :y="y">{{ n }}</text>
    </g>
  </g>
</template>
