<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useEventListener } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import ClockFace, { type Hand } from '@/components/ClockFace.vue'
import DragArrowsAnswer from '@/components/DragArrowsAnswer.vue'
import DragRound from './DragRound.vue'
import ModeIcon from '@/components/ModeIcon.vue'
import ProgressDots from '@/components/ProgressDots.vue'
import SetTimeAnswer from '@/components/SetTimeAnswer.vue'
import WrongAnswerPopup from '@/components/WrongAnswerPopup.vue'
import HintClock from '@/components/HintClock.vue'
import { clockTime, type ClockTime } from '@/game/clockTime'
import { dragHourHand, dragMinuteHand } from '@/game/handDrag'
import { describeMistake, type Mistake } from '@/game/mistakes'
import { currentTask, isNumbersRound } from '@/game/round'
import { usePlayStore } from '@/stores/play'

const { t } = useI18n()
const router = useRouter()
const play = usePlayStore()

/** How long a right Answer in Teach shows "Right! Next…" before the next Task. */
const RIGHT_PAUSE_MS = 1200

// The router opens this screen with an unfinished Round. The Round goes away when the Player
// leaves, and has no current Task while the Summary loads; the screen draws nothing then.
// The drag Games have their own screen part; the rest of this file plays the Clock Time Games.
const numbersRound = computed(() => (play.round && isNumbersRound(play.round) ? play.round : null))
const round = computed(() => (play.round && !isNumbersRound(play.round) ? play.round : null))

/** Teach: the Task just answered right, kept on screen with the toast before moving on. */
const rightTask = ref<number | null>(null)
/** Teach: the wrong-Answer popup. */
const wrongAnswer = ref<{ answer: ClockTime; mistake: Mistake } | null>(null)

const shownIndex = computed(() => rightTask.value ?? round.value?.current ?? 0)
const task = computed(() => round.value?.tasks[shownIndex.value] ?? null)
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

/** Teach: the popup's Set correct answer closes it and puts the Hint in; the Player still submits. */
function setCorrectAnswer() {
  const correct = wrongAnswer.value?.answer
  wrongAnswer.value = null
  if (!correct) return
  if (round.value?.game === 'dragArrows') {
    helping.value = true
    hands.value = correct
  } else {
    answerPanel.value?.fill(correct)
  }
}

// A reload would lose the Round, so ask the browser to confirm. Browsers show their own text.
useEventListener(window, 'beforeunload', (event: BeforeUnloadEvent) => {
  event.preventDefault()
  event.returnValue = ''
})
</script>

<template>
  <DragRound v-if="numbersRound" :round="numbersRound" />
  <div v-else-if="round && task" class="round">
    <div class="progress">
      <ProgressDots :statuses="round.tasks.map((t) => t.status)" :current="shownIndex" />
      <div class="task-no">
        {{ t('round.progress', { n: shownIndex + 1, total: round.tasks.length }) }} ·
        <ModeIcon :mode="round.mode" inline />{{ t(`modes.${round.mode}.name`) }}
      </div>
    </div>
    <section class="play" :class="round.game">
      <div class="clock-side">
        <div class="clock-wrap">
          <ClockFace
            v-if="round.game === 'setTime'"
            class="clock"
            :time="task.answer"
            :rim="rim"
            :pointed="round.mode === 'teach'"
          />
          <!-- A fresh clock per Task, so a drag still held from the last Task does not carry over. -->
          <ClockFace
            v-else
            :key="shownIndex"
            class="clock"
            :time="hands"
            :rim="rim"
            draggable
            :pointed="round.mode === 'teach'"
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
        :line="t(`teach.mistakes.${wrongAnswer.mistake.kind}`, wrongAnswer.mistake.params)"
        @dismiss="wrongAnswer = null"
        @set-correct="setCorrectAnswer"
      >
        <HintClock :time="wrongAnswer.answer" />
      </WrongAnswerPopup>
    </section>
  </div>
</template>

<style scoped>
.round {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  /* vw first: old Android WebViews lack container units (docs/android-checks.md). */
  padding: 16px clamp(20px, 4.7vw, 48px) 28px;
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
  width: min(100%, 41vw);
  width: min(100%, 41cqi);
  /* A wide, low window: the clock also fits the height under the dots. */
  width: min(100%, 41cqi, max(200px, 100cqh - 140px));
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

/* A short desktop window: less room around the answer, so a Round fits with nothing to scroll. */
@media (min-width: 769px) and (min-height: 501px) and (max-height: 760px) and (orientation: landscape) {
  .round {
    padding-top: 6px;
    padding-bottom: 12px;
  }
  .answer-side {
    gap: 8px;
  }
  h1 {
    font-size: 26px;
  }
}

/* Phone upright: the clock sits above the answer. */
@media (--phone) {
  .round {
    padding: 0 20px 12px;
  }
  .progress {
    padding-bottom: 2px;
  }
  /*
   * A column: the clock side takes the height the rest leaves (header, dots, answer area), up to
   * the full width, and never less than ~150 px. Nothing in the answer area changes height during a
   * Round (a time-box error lies over the foot of the clock, see SetTimeAnswer), and a wrong Answer only
   * opens a popup, so the clock never changes size.
   */
  .play {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
  }
  .clock-side {
    flex: 1 1 0;
    min-height: 150px;
    justify-content: center;
    container-type: size;
  }
  /* Old Android WebViews lack container units: there the clock is the screen's height less what
     the rest of the Round takes (measured at every phone size: it does not change), as wide as
     the screen at most and never under 150 px. */
  .setTime .clock {
    width: clamp(150px, 100vh - var(--inset-top) - var(--inset-bottom) - 482px, 100%);
  }
  .dragArrows .clock {
    width: clamp(150px, 100vh - var(--inset-top) - var(--inset-bottom) - 358px, 100%);
  }
  @supports (width: 1cqw) {
    .play .clock {
      width: min(100cqw, 100cqh);
    }
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
/*
 * A sideways phone: the clock beside the answer, as big as the screen's height under the dots
 * allows, so it is seen whole. A taller answer runs on below it and the page scrolls.
 */
@media (--phone-sideways) {
  .play {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: minmax(0, 1fr);
    flex-basis: 0;
    min-height: 150px;
  }
  /* The row keeps the screen's height so the clock stays whole; a taller answer runs past it, and
     its own padding keeps the Round's bottom room under Submit (the Round's padding stays above). */
  .answer-side {
    align-self: safe center;
    padding-bottom: 12px;
  }
}
</style>
