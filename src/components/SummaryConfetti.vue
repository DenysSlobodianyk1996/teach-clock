<script setup lang="ts">
/** A small burst of confetti that drops in once when the Summary opens. Decoration only. */
const COLOURS = ['var(--accent)', 'var(--bad)', 'var(--good)', 'var(--tile)']
// Fixed spots, spread along the top and kept clear of the middle where the headline sits.
const PIECES = [
  [60, 150, 0],
  [120, 30, 25],
  [210, 120, -10],
  [300, 60, -30],
  [380, 170, 15],
  [620, 150, -20],
  [700, 40, 35],
  [780, 110, 40],
  [880, 40, -15],
  [930, 150, 10],
].map(([x, y, turn], i) => ({
  x: x!,
  y: y!,
  turn: turn!,
  round: i % 3 === 1,
  colour: COLOURS[i % COLOURS.length],
  delay: `${(i % 5) * 0.08}s`,
}))
</script>

<template>
  <svg
    class="confetti"
    viewBox="0 0 1000 220"
    preserveAspectRatio="xMidYMin meet"
    aria-hidden="true"
  >
    <g v-for="(p, i) in PIECES" :key="i" class="piece" :style="{ animationDelay: p.delay }">
      <circle v-if="p.round" :cx="p.x" :cy="p.y" r="7" :style="{ fill: p.colour }" />
      <rect
        v-else
        :x="p.x - 7"
        :y="p.y - 11"
        width="14"
        height="22"
        rx="4"
        :transform="`rotate(${p.turn} ${p.x} ${p.y})`"
        :style="{ fill: p.colour }"
      />
    </g>
  </svg>
</template>

<style scoped>
.confetti {
  position: absolute;
  inset: 0 0 auto;
  width: 100%;
  height: auto;
  max-height: 220px;
  pointer-events: none;
}
.piece {
  animation: drop 0.9s cubic-bezier(0.2, 0.7, 0.3, 1) both;
}
@keyframes drop {
  from {
    opacity: 0;
    transform: translateY(-160px) rotate(-40deg);
  }
  to {
    opacity: 0.95;
    transform: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .piece {
    animation: none;
    opacity: 0.95;
  }
}
</style>
