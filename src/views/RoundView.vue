<script setup lang="ts">
import { computed } from 'vue'
import { useEventListener } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import ProgressDots from '@/components/ProgressDots.vue'
import { usePlayStore } from '@/stores/play'

const { t } = useI18n()
const play = usePlayStore()

// The router only opens this screen with a Round in memory.
const round = computed(() => play.round!)
const current = 0

const details = computed(() => {
  const parts = [t(`games.${round.value.game}.name`), t(`modes.${round.value.mode}.name`)]
  if (round.value.level !== null) parts.push(t(`levels.${round.value.level}.name`))
  return parts.join(' · ')
})

// A reload would lose the Round, so ask the browser to confirm. Browsers show their own text.
useEventListener(window, 'beforeunload', (event: BeforeUnloadEvent) => {
  event.preventDefault()
  event.returnValue = ''
})
</script>

<template>
  <div class="round">
    <div class="progress">
      <ProgressDots :total="round.taskCount" :current="current" />
      <div class="task-no">
        {{ t('round.progress', { n: current + 1, total: round.taskCount }) }} ·
        {{ t(`modes.${round.mode}.name`) }}
      </div>
    </div>
    <section class="play-area" data-testid="play-area">
      <p class="placeholder">{{ t('round.comingSoon') }}</p>
      <p class="details">{{ details }}</p>
    </section>
  </div>
</template>

<style scoped>
.round {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 16px clamp(20px, 4.7cqi, 48px) 28px;
}
.progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding-bottom: 6px;
}
.task-no {
  font-size: 15px;
  font-weight: 700;
  color: var(--muted);
}
.play-area {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
  border: 3px dashed var(--line);
  border-radius: 28px;
  text-align: center;
}
.placeholder {
  margin: 0;
  font-size: 26px;
  font-weight: 900;
}
.details {
  margin: 0;
  color: var(--muted);
}
</style>
