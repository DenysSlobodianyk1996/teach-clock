<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { TaskStatus } from '@/game/round'

/** `placed`: Drag Numbers in Test before Submit, a number on the face whose result is still hidden. */
export type DotStatus = TaskStatus | 'placed'

/**
 * One dot per Task, coloured by its status. `current` is the 0-based Task being played; Drag
 * Numbers has none and passes its own `label`.
 */
defineProps<
  { statuses: readonly DotStatus[] } & (
    { current: number; label?: never } | { current?: never; label: string }
  )
>()

const { t } = useI18n()

const STATUS_CLASS: Record<DotStatus, string | null> = {
  pending: null,
  placed: 'placed',
  right: 'ok',
  helped: 'help',
  wrong: 'bad',
}
</script>

<template>
  <div
    class="dots"
    role="img"
    :aria-label="
      label ??
      t('round.progressLabel', {
        n: (current ?? 0) + 1,
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
.dot.placed {
  background: var(--accent);
}
.dot.help {
  background: var(--help);
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
@media (--phone) {
  .dots {
    gap: 8px;
  }
}
</style>
