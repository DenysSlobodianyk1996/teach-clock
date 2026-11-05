<script setup lang="ts">
import { useI18n } from 'vue-i18n'

/** One dot per Task; `current` is the 0-based Task being played. Result colours come with ticket 03. */
defineProps<{ total: number; current: number }>()

const { t } = useI18n()
</script>

<template>
  <div class="dots" role="img" :aria-label="t('round.progressLabel', { n: current + 1, total })">
    <span v-for="i in total" :key="i" class="dot" :class="{ now: i - 1 === current }" />
  </div>
</template>

<style scoped>
.dots {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: center;
}
.dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--todo);
}
.dot.now {
  width: 22px;
  height: 22px;
  background: transparent;
  border: 4px solid var(--accent);
}
@media (max-width: 600px), (max-height: 500px) {
  .dots {
    gap: 8px;
  }
}
</style>
