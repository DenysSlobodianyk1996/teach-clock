<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { TaskStatus } from '@/game/round'

/** One dot per Task, coloured by its status; `current` is the 0-based Task being played. */
defineProps<{ statuses: readonly TaskStatus[]; current: number }>()

const { t } = useI18n()

const STATUS_CLASS: Record<TaskStatus, string | null> = { pending: null, right: 'ok', wrong: 'bad' }
</script>

<template>
  <div
    class="dots"
    role="img"
    :aria-label="
      t('round.progressLabel', {
        n: current + 1,
        total: statuses.length,
      })
    "
  >
    <span
      v-for="(status, i) in statuses"
      :key="i"
      class="dot"
      :class="i === current ? 'now' : STATUS_CLASS[status]"
    />
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
.dot.ok {
  background: var(--good);
}
.dot.bad {
  background: var(--bad);
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
