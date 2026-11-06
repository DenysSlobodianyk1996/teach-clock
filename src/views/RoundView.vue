<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useEventListener } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import ClockFace, { type Hand } from '@/components/ClockFace.vue'
import DragArrowsAnswer from '@/components/DragArrowsAnswer.vue'
import DragNumbersRound from './DragNumbersRound.vue'
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
// Drag Numbers has its own screen part; the rest of this file plays the Clock Time Games.
const numbersRound = computed(() => (play.round?.game === 'dragNumbers' ? play.round : null))
const round = computed(() => (play.round?.game !== 'dragNumbers' ? play.round : null))

/** Teach: the Task just answered right, kept on screen with the toast before moving on. */
const rightTask = ref<number | null>(null)
/** Teach: the wrong-Answer popup. */
const wrongAnswer = ref<{ answer: ClockTime; mistake: Mistake } | null>(null)

const shownIndex = computed(() => rightTask.value ?? round.value?.current ?? 0)
const task = computed(() => round.value?.tasks[shownIndex.value] ?? null)
const taskHint = computed(() =>
  round.value && rightTask.value === null ? hint(round.value) : null,
)
/** Teach: a green rim on the clock while "Right! Next…" shows. */
const rim = computed(() => (rightTask.value !== null ? 'good' : undefined))
const busy = computed(
  () => play.askingToLeave || wrongAnswer.value !== null || rightTask.value !== null,
)

/** Drag Arrows: the Clock Time both hands show. Every Task starts at 12:00. */
const START = clockTime(12, 0)
const hands = ref<ClockTime>(START)
/** Teach: "Set correct answer" is turning the hands; a drag stops the animation. */
const helping = ref(false)
watch(shownIndex, () => {
  hands.value = START
  helping.value = false
})

function dragHand({ hand, angle }: { hand: Hand; angle: number }) {
  const level = round.value?.level
  if (busy.value || !level) return
  helping.value = false
  hands.value =
    hand === 'minute' ? dragMinuteHand(hands.value, angle, level) : dragHourHand(hands.value, angle)
}

const answerPanel = ref<InstanceType<typeof SetTimeAnswer>>()
let pause: ReturnType<typeof setTimeout> | undefined
onBeforeUnmount(() => clearTimeout(pause))

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
  if (!taskHint.value || busy.value) return
  if (round.value?.game === 'dragArrows') {
    helping.value = true
    hands.value = taskHint.value
  } else {
    answerPanel.value?.fill(taskHint.value)
  }
}

// A reload would lose the Round, so ask the browser to confirm. Browsers show their own text.
useEventListener(window, 'beforeunload', (event: BeforeUnloadEvent) => {
  event.preventDefault()
  event.returnValue = ''
})
</script>

<template>
  <DragNumbersRound v-if="numbersRound" :round="numbersRound" />
  <div v-else-if="round && task" class="round">
    <div class="progress">
      <ProgressDots :statuses="round.tasks.map((t) => t.status)" :current="shownIndex" />
      <div class="task-no">
        {{ t('round.progress', { n: shownIndex + 1, total: round.tasks.length }) }} ·
        {{ t(`modes.${round.mode}.name`) }}
      </div>
    </div>
    <section class="play" :class="[round.game, { 'has-hint': taskHint }]">
      <div class="clock-side">
        <div class="clock-wrap">
          <ClockFace v-if="round.game === 'setTime'" class="clock" :time="task.answer" :rim="rim" />
          <!-- A fresh clock per Task, so a drag still held from the last Task does not carry over. -->
          <ClockFace
            v-else
            :key="shownIndex"
            class="clock"
            :time="hands"
            :rim="rim"
            draggable
            :animate="helping"
            @drag="dragHand"
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
        <!-- Teach keeps the Hint's space from the first Task, so the clock never moves when it
             appears. Until then it is hidden, so it is neither seen nor read out. -->
        <HintPanel
          v-if="round.mode === 'teach'"
          :class="{ waiting: !taskHint }"
          :hint="taskHint ?? START"
          @help="setCorrectAnswer"
        />
      </div>
      <div class="answer-side">
        <h1>{{ t(round.game === 'setTime' ? 'round.question' : 'round.setHands') }}</h1>
        <SetTimeAnswer
          v-if="round.game === 'setTime'"
          ref="answerPanel"
          :key="shownIndex"
          :disabled="busy"
          @submit="submit"
        />
        <DragArrowsAnswer v-else :target="task.answer" :disabled="busy" @submit="submit(hands)" />
      </div>
      <WrongAnswerPopup
        v-if="wrongAnswer"
        :answer="wrongAnswer.answer"
        :mistake="wrongAnswer.mistake"
        @close="wrongAnswer = null"
      />
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
.waiting {
  visibility: hidden;
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

/* Phone upright: the clock sits above the answer. */
@media (max-width: 600px), (max-height: 500px) {
  .round {
    padding: 4px 20px 20px;
  }
  .play {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 8px;
    align-content: start;
  }
  /* A phone keeps no empty room for the Hint: the clock may move when the Hint appears. */
  .waiting {
    display: none;
  }
  /*
   * The clock takes the height the rest of the screen leaves, up to the full width. Each number is
   * the height of everything else (header, dots, answer area, gaps) on a 360 × 720 phone; the
   * small-phone browser tests check it all fits. With the Hint showing, the clock shrinks to make room.
   */
  .setTime .clock {
    width: clamp(150px, 100svh - 484px, 100vw - 40px);
  }
  .setTime.has-hint .clock {
    width: clamp(150px, 100svh - 562px, 100vw - 40px);
  }
  .dragArrows .clock {
    width: clamp(150px, 100svh - 360px, 100vw - 40px);
  }
  .dragArrows.has-hint .clock {
    width: clamp(150px, 100svh - 438px, 100vw - 40px);
  }
  .clock-side {
    gap: 6px;
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
