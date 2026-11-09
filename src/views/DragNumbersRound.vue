<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ModeIcon from '@/components/ModeIcon.vue'
import NumberBoard from '@/components/NumberBoard.vue'
import ProgressDots, { type DotStatus } from '@/components/ProgressDots.vue'
import { canSubmit, type Neighbours } from '@/game/dragNumbers'
import type { NumbersRound } from '@/game/round'
import { usePlayStore } from '@/stores/play'

/** The Round screen for Drag Numbers. RoundView shows it while a Drag Numbers Round is in play. */
const props = defineProps<{ round: NumbersRound }>()

const { t } = useI18n()
const router = useRouter()
const play = usePlayStore()

/** How long the full face shows before the Summary. */
const DONE_PAUSE_MS = 1200

/** Teach: "N goes between…", shown from a wrong drop until the next drop. */
const hint = ref<Neighbours | null>(null)
const done = ref(false)
const busy = computed(() => play.askingToLeave || done.value)

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
onBeforeUnmount(() => clearTimeout(pause))

function drop(number: number, slot: number) {
  if (busy.value) return
  const outcome = play.dropNumber(number, slot)
  hint.value = outcome.hint
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
  <div class="round">
    <div class="progress">
      <ProgressDots :statuses="dots" :label="progress.label" />
      <div class="task-no">
        {{ progress.text }} · <ModeIcon :mode="round.mode" inline />{{
          t(`modes.${round.mode}.name`)
        }}
      </div>
    </div>
    <NumberBoard
      :hinted="hint !== null"
      :slots="round.slots"
      :tray="round.tray"
      :marked="hint?.number"
      :movable="test"
      :disabled="busy"
      @drop="drop"
      @to-tray="toTray"
    >
      <template #clock>
        <!-- Always in the page, so screen readers announce the text when it appears. -->
        <p class="toast-status" role="status">
          <span v-if="hint" class="toast">{{ t('numbers.between', { ...hint }) }}</span>
        </p>
      </template>
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
/* A fixed height that fits the hint, so the face does not jump when a hint comes and goes. */
.toast-status {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  margin: 0;
}
.toast {
  display: inline-block;
  padding: 12px 22px;
  line-height: 24px;
  border-radius: 999px;
  background: var(--pop);
  color: var(--pop-ink);
  font-size: 20px;
  font-weight: 800;
  white-space: nowrap;
  box-shadow: var(--shadow);
}
@media (max-width: 600px), (max-height: 500px) {
  .round {
    padding: 4px 20px 20px;
  }
  h1 {
    font-size: 22px;
  }
  .help {
    font-size: 15px;
  }
  /* A phone keeps no empty room for the hint: the face may move when a hint appears. */
  .toast-status {
    height: auto;
  }
  .toast {
    font-size: 17px;
    line-height: 22px;
    padding: 10px 18px;
  }
}
</style>
