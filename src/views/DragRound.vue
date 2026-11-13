<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ModeIcon from '@/components/ModeIcon.vue'
import NumberBoard from '@/components/NumberBoard.vue'
import ProgressDots, { type DotStatus } from '@/components/ProgressDots.vue'
import WrongAnswerPopup from '@/components/WrongAnswerPopup.vue'
import HintFace from '@/components/HintFace.vue'
import { canSubmit, shownNeighbours, type DropOutcome, type Neighbours } from '@/game/dragNumbers'
import type { NumbersRound } from '@/game/round'
import { usePlayStore } from '@/stores/play'

/** The Round screen for the drag Games (Drag Hours, Drag Minutes), shown by RoundView. */
const props = defineProps<{ round: NumbersRound }>()

const { t } = useI18n()
const router = useRouter()
const play = usePlayStore()

/** How long the full face shows before the Summary. */
const DONE_PAUSE_MS = 1200
/** How long a slot filled by Set correct answer stays ringed green. */
const FLASH_MS = 900

/** Teach: where the last wrongly dropped number goes. Its tray tile stays ringed until the next drop. */
const hint = ref<Neighbours | null>(null)
/** Teach: the wrong-drop popup is open (for `hint`). */
const popupOpen = ref(false)
/** The popup's line, in the values the tiles show. */
const shownHint = computed(() => hint.value && shownNeighbours(props.round.game, hint.value))
/** The slot Set correct answer just filled, ringed green for a moment. */
const flash = ref<number | null>(null)
const root = ref<HTMLElement>()
const done = ref(false)
const busy = computed(() => play.askingToLeave || done.value || popupOpen.value)

const test = computed(() => props.round.mode === 'test')
const placed = computed(() => props.round.slots.filter((n) => n !== null).length)
const total = computed(() => props.round.tasks.length)
/** Test hides right and wrong until Submit: the dots only count the numbers on the face. */
const dots = computed((): DotStatus[] =>
  test.value
    ? props.round.tasks.map((_, i) => (i < placed.value ? 'placed' : 'pending'))
    : props.round.tasks.map((t) => t.status),
)
const progress = computed(() => {
  const counts = { n: placed.value, total: total.value }
  return test.value
    ? { text: t('numbers.placedCount', counts), label: t('numbers.placedLabel', counts) }
    : { text: t('numbers.progress', counts), label: t('numbers.progressLabel', counts) }
})

let pause: ReturnType<typeof setTimeout> | undefined
let flashing: ReturnType<typeof setTimeout> | undefined
onBeforeUnmount(() => {
  clearTimeout(pause)
  clearTimeout(flashing)
})

function drop(number: number, slot: number) {
  if (busy.value) return
  flash.value = null
  after(play.dropNumber(number, slot))
}

/** Teach, the popup's Set correct answer: closes it, puts the number on its slot, rings it green. */
function setCorrectAnswer() {
  // Close the popup first: `busy` counts an open popup, and the check below must not see it.
  popupOpen.value = false
  const number = hint.value?.number
  if (busy.value || number === undefined) return
  const outcome = play.setCorrectNumber(number)
  if (outcome.placed) {
    flash.value = props.round.tasks[number - 1]!.answer
    clearTimeout(flashing)
    flashing = setTimeout(() => (flash.value = null), FLASH_MS)
  }
  after(outcome)
  // The popup is gone: keep keyboard focus in play, on the next tray number.
  nextTick(() => root.value?.querySelector<HTMLElement>('.tray .tile')?.focus())
}

/** Opens the popup after a wrong drop, and moves on to the Summary once the face is full. */
function after(outcome: DropOutcome) {
  hint.value = outcome.hint
  popupOpen.value = outcome.hint !== null
  if (outcome.finished) {
    done.value = true
    pause = setTimeout(() => {
      if (play.round) router.push({ name: 'summary' })
    }, DONE_PAUSE_MS)
  }
}

function toTray(number: number) {
  if (!busy.value) play.returnToTray(number)
}

/** Test: "Готово" scores the face and opens the Summary. */
function submit() {
  if (busy.value || !canSubmit(props.round)) return
  done.value = true
  play.submitPlacements()
  router.push({ name: 'summary' })
}
</script>

<template>
  <div ref="root" class="round">
    <div class="progress">
      <ProgressDots :statuses="dots" :label="progress.label" />
      <div class="task-no">
        {{ progress.text }} · <ModeIcon :mode="round.mode" inline />{{
          t(`modes.${round.mode}.name`)
        }}
      </div>
    </div>
    <NumberBoard
      :game="round.game"
      :slots="round.slots"
      :tray="round.tray"
      :marked="hint?.number"
      :movable="test"
      :disabled="busy"
      :flash="flash"
      @drop="drop"
      @to-tray="toTray"
    >
      <template #heading>
        <h1>{{ t('numbers.heading') }}</h1>
      </template>
      <template v-if="test">
        <p class="help">
          {{
            round.tray.length
              ? t('numbers.testHelp', { n: round.tray.length })
              : t('numbers.allPlaced')
          }}
        </p>
        <!-- Only with all 12 on the face, so half a clock can't be submitted. -->
        <button v-if="canSubmit(round)" class="btn submit" type="button" @click="submit">
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
          {{ t('numbers.submit') }}
        </button>
      </template>
      <p v-else-if="round.tray.length" class="help">{{ t('numbers.help') }}</p>
    </NumberBoard>
    <WrongAnswerPopup
      v-if="popupOpen && hint && shownHint"
      :line="t('numbers.between', { ...shownHint })"
      @dismiss="popupOpen = false"
      @set-correct="setCorrectAnswer"
    >
      <HintFace :game="round.game" :number="hint.number" />
    </WrongAnswerPopup>
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
h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 900;
  text-align: center;
}
.submit {
  width: min(300px, 100%);
}
.help {
  max-width: 360px;
  margin: 0;
  font-size: 17px;
  color: var(--muted);
  text-align: center;
}
@media (--phone) {
  .round {
    padding: 4px 20px 20px;
  }
  h1 {
    font-size: 22px;
  }
  .help {
    font-size: 15px;
  }
}
</style>
