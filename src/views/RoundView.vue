<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useEventListener } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import ClockFace, { type Hand } from '@/components/ClockFace.vue'
import DragArrowsAnswer from '@/components/DragArrowsAnswer.vue'
import ProgressDots from '@/components/ProgressDots.vue'
import HintPanel from '@/components/HintPanel.vue'
import SetTimeAnswer from '@/components/SetTimeAnswer.vue'
import WrongAnswerPopup from '@/components/WrongAnswerPopup.vue'
import { clockTime, type ClockTime } from '@/game/clockTime'
import { dragHourHand, dragMinuteHand } from '@/game/handDrag'
import { describeMistake, type Mistake } from '@/game/mistakes'
import { currentTask, hint } from '@/game/round'
import { usePlayStore } from '@/stores/play'

const { t } = useI18n()
const router = useRouter()
const play = usePlayStore()

/** How long a right Answer in Teach shows "Right! Next…" before the next Task. */
const RIGHT_PAUSE_MS = 1200

// The router opens this screen with an unfinished Round. The Round goes away when the Player
// leaves, and has no current Task while the Summary loads; the screen draws nothing then.
const round = computed(() => play.round)

/** Teach: the Task just answered right, kept on screen with the toast before moving on. */
const rightTask = ref<number | null>(null)
/** Teach: the wrong-Answer popup. */
const wrongAnswer = ref<{ answer: ClockTime; mistake: Mistake } | null>(null)

const shownIndex = computed(() => rightTask.value ?? round.value?.current ?? 0)
const task = computed(() => round.value?.tasks[shownIndex.value] ?? null)
const taskHint = computed(() =>
  round.value && rightTask.value === null ? hint(round.value) : null,
)
const busy = computed(
  () => play.askingToLeave || wrongAnswer.value !== null || rightTask.value !== null,
)

/** Drag Arrows: the Clock Time both hands show. Every Task starts at 12:00. */
const START = clockTime(12, 0)
const hands = ref<ClockTime>(START)
watch(shownIndex, () => (hands.value = START))

function dragHand({ hand, angle }: { hand: Hand; angle: number }) {
  const level = round.value?.level
  if (busy.value || !level) return
  hands.value =
    hand === 'minute' ? dragMinuteHand(hands.value, angle, level) : dragHourHand(hands.value, angle)
}

const answerPanel = ref<InstanceType<typeof SetTimeAnswer>>()
let pause: ReturnType<typeof setTimeout> | undefined
onBeforeUnmount(() => clearTimeout(pause))

const details = computed(() => {
  if (!round.value) return ''
  const parts = [t(`games.${round.value.game}.name`), t(`modes.${round.value.mode}.name`)]
  if (round.value.level !== null) parts.push(t(`levels.${round.value.level}.name`))
  return parts.join(' · ')
})

function submit(time: ClockTime) {
  const played = round.value && currentTask(round.value)
  if (!played || busy.value) return
  const index = round.value!.current
  const outcome = play.submitAnswer(time)
  if (!outcome.movedOn) {
    wrongAnswer.value = { answer: played.answer, mistake: describeMistake(played.answer, time) }
  } else if (outcome.right && round.value!.mode === 'teach') {
    rightTask.value = index
    pause = setTimeout(() => {
      rightTask.value = null
      if (outcome.finished && play.round) router.push({ name: 'summary' })
    }, RIGHT_PAUSE_MS)
  } else if (outcome.finished) {
    router.push({ name: 'summary' })
  }
}

function setCorrectAnswer() {
  if (taskHint.value) answerPanel.value?.fill(taskHint.value)
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
      <ProgressDots :statuses="round.tasks.map((t) => t.status)" :current="shownIndex" />
      <div class="task-no">
        {{ t('round.progress', { n: shownIndex + 1, total: round.tasks.length }) }} ·
        {{ t(`modes.${round.mode}.name`) }}
      </div>
    </div>
    <section v-if="round.game === 'setTime'" class="play" :class="{ 'has-hint': taskHint }">
      <div class="clock-side">
        <div class="clock-wrap">
          <ClockFace
            class="clock"
            :time="task.answer"
            :rim="rightTask !== null ? 'good' : undefined"
          />
          <!-- Always in the page, so screen readers announce the text when it appears. -->
          <p class="toast-status" role="status">
            <span v-if="rightTask !== null" class="toast">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12.5l4.5 4.5L19 7" />
              </svg>
              {{ t('teach.right') }}
            </span>
          </p>
        </div>
        <HintPanel v-if="taskHint" :hint="taskHint" @help="setCorrectAnswer" />
      </div>
      <div class="answer-side">
        <h1>{{ t('round.question') }}</h1>
        <SetTimeAnswer ref="answerPanel" :key="shownIndex" :disabled="busy" @submit="submit" />
      </div>
      <WrongAnswerPopup
        v-if="wrongAnswer"
        :answer="wrongAnswer.answer"
        :mistake="wrongAnswer.mistake"
        @close="wrongAnswer = null"
      />
    </section>
    <!-- Drag Arrows Teach arrives with ticket 06. -->
    <section v-else-if="round.game === 'dragArrows' && round.mode === 'test'" class="play">
      <div class="clock-side">
        <div class="clock-wrap">
          <!-- A fresh clock per Task, so a drag still held from the last Task does not carry over. -->
          <ClockFace :key="shownIndex" class="clock" :time="hands" draggable @drag="dragHand" />
        </div>
      </div>
      <div class="answer-side">
        <h1>{{ t('round.setHands') }}</h1>
        <DragArrowsAnswer :target="task.answer" :disabled="busy" @submit="submit(hands)" />
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
.play {
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  align-items: center;
}
.clock-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.clock-wrap {
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
}
.toast-status {
  position: absolute;
  bottom: 4%;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
}
.toast {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  padding: 14px 22px;
  border-radius: 999px;
  background: var(--pop);
  color: var(--pop-ink);
  font-size: 20px;
  font-weight: 800;
  white-space: nowrap;
  box-shadow: var(--shadow);
}
.toast svg {
  width: 26px;
  height: 26px;
  flex: none;
  color: var(--good);
  stroke: currentColor;
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
  .play {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 14px;
    align-content: start;
  }
  .clock {
    width: min(236px, 60vw);
  }
  /* Make room for the Hint panel so Submit stays on screen. */
  .has-hint .clock {
    width: min(170px, 44vw);
  }
  .clock-side {
    gap: 10px;
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
  .play {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
