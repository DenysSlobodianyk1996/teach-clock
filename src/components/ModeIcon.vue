<script setup lang="ts">
/** The Mode's icon: a lightbulb for Teach, a check mark in a circle for Test. Decorative: the Mode name is always next to it. */
import type { Mode } from '@/game/settings'

/** `inline`: sized to sit in a line of text, like a letter (the Round's progress line). */
defineProps<{ mode: Mode; inline?: boolean }>()
</script>

<template>
  <svg class="mode-icon" :class="[mode, { inline }]" viewBox="-100 -100 200 200" aria-hidden="true">
    <template v-if="mode === 'teach'">
      <g class="m-rays">
        <line x1="0" y1="-78" x2="0" y2="-96" />
        <line x1="-42" y1="-60" x2="-55" y2="-73" />
        <line x1="42" y1="-60" x2="55" y2="-73" />
        <line x1="-60" y1="-18" x2="-78" y2="-18" />
        <line x1="60" y1="-18" x2="78" y2="-18" />
      </g>
      <path class="m-bulb" d="M -28 18 A 46 46 0 1 1 28 18 L 22 40 L -22 40 Z" />
      <path class="m-filament" d="M -11 30 L -11 6 L 0 -6 L 11 6 L 11 30" />
      <rect class="m-base" x="-24" y="48" width="48" height="12" rx="6" />
      <rect class="m-base" x="-16" y="66" width="32" height="12" rx="6" />
    </template>
    <template v-else>
      <circle class="m-badge" r="78" />
      <path class="m-check" d="M -38 2 L -12 28 L 40 -26" />
    </template>
  </svg>
</template>

<style scoped>
.inline {
  width: 1.3em;
  height: 1.3em;
  margin-right: 0.25em;
  vertical-align: -0.3em;
}
/* The rays and the base take the text colour around the icon, so they read on cards and on the page. */
.m-rays line {
  stroke: currentColor;
  stroke-width: 9;
  stroke-linecap: round;
}
.m-bulb {
  fill: var(--help);
}
.m-filament {
  fill: none;
  stroke: var(--accent-ink);
  stroke-width: 6;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.m-base {
  fill: currentColor;
}
.m-badge {
  fill: var(--good);
}
.m-check {
  fill: none;
  stroke: var(--accent-ink);
  stroke-width: 16;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
