<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEventListener } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import ClockFace from '@/components/ClockFace.vue'
import ProgressDots from '@/components/ProgressDots.vue'
import SetTimeAnswer from '@/components/SetTimeAnswer.vue'
import type { ClockTime } from '@/game/clockTime'
import { currentTask } from '@/game/round'
import { usePlayStore } from '@/stores/play'

const { t } = useI18n()
const router = useRouter()
const play = usePlayStore()

// The router opens this screen with an unfinished Round. The Round goes away when the Player
// leaves, and has no current Task while the Summary loads; the screen draws nothing then.
const round = computed(() => play.round)
const task = computed(() => round.value && currentTask(round.value))

const details = computed(() => {
  if (!round.value) return ''
  const parts = [t(`games.${round.value.game}.name`), t(`modes.${round.value.mode}.name`)]
  if (round.value.level !== null) parts.push(t(`levels.${round.value.level}.name`))
  return parts.join(' · ')
})

function submit(time: ClockTime) {
  // Teach's feedback arrives with ticket 04; for now every Answer moves on.
  if (play.submitAnswer(time).finished) router.push({ name: 'summary' })
}

// A reload would lose the Round, so ask the browser to confirm. Browsers show their own text.
useEventListener(window, 'beforeunload', (event: BeforeUnloadEvent) => {
  event.preventDefault()
  event.returnValue = ''
})
</script>

<template>
  <div v-if="round && task" class="round">
    <div class="progress">
      <ProgressDots :statuses="round.tasks.map((t) => t.status)" :current="round.current" />
      <div class="task-no">
        {{ t('round.progress', { n: round.current + 1, total: round.tasks.length }) }} ·
        {{ t(`modes.${round.mode}.name`) }}
      </div>
    </div>
    <section v-if="round.game === 'setTime'" class="set-time">
      <div class="clock-side">
        <ClockFace class="clock" :time="task.answer" />
      </div>
      <div class="answer-side">
        <h1>{{ t('round.question') }}</h1>
        <SetTimeAnswer :key="round.current" :disabled="play.askingToLeave" @submit="submit" />
      </div>
    </section>
    <section v-else class="play-area" data-testid="play-area">
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
.set-time {
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  align-items: center;
}
.clock-side {
  display: flex;
  justify-content: center;
}
.clock {
  width: min(100%, 41cqi);
  height: auto;
  aspect-ratio: 1;
}
.answer-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}
h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 900;
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

/* Phone upright: the clock sits above the answer. */
@media (max-width: 600px), (max-height: 500px) {
  .round {
    padding: 4px 20px 20px;
  }
  .set-time {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 14px;
    align-content: start;
  }
  .clock {
    width: min(236px, 60vw);
  }
  /* No room for the question on a phone; keep it for screen readers. */
  .answer-side h1 {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
}
@media (max-height: 500px) and (min-width: 601px) {
  .set-time {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
