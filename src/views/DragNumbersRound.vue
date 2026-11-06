<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import NumberBoard from '@/components/NumberBoard.vue'
import ProgressDots from '@/components/ProgressDots.vue'
import type { Neighbours } from '@/game/dragNumbers'
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

const placed = computed(() => props.round.slots.filter((n) => n !== null).length)
const total = computed(() => props.round.tasks.length)

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
</script>

<template>
  <div class="round">
    <div class="progress">
      <ProgressDots
        :statuses="round.tasks.map((t) => t.status)"
        :label="t('numbers.progressLabel', { n: placed, total })"
      />
      <div class="task-no">
        {{ t('numbers.progress', { n: placed, total }) }} · {{ t(`modes.${round.mode}.name`) }}
      </div>
    </div>
    <!-- Drag Numbers in Test arrives with ticket 08. -->
    <section v-if="round.mode === 'test'" class="play-area" data-testid="play-area">
      <p class="placeholder">{{ t('round.comingSoon') }}</p>
    </section>
    <NumberBoard
      v-else
      :slots="round.slots"
      :tray="round.tray"
      :marked="hint?.number"
      :disabled="busy"
      @drop="drop"
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
      <p v-if="round.tray.length" class="help">{{ t('numbers.help') }}</p>
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
.play-area {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  border: 3px dashed var(--line);
  border-radius: 28px;
}
.placeholder {
  margin: 0;
  font-size: 26px;
  font-weight: 900;
}
.help {
  max-width: 360px;
  margin: 0;
  font-size: 17px;
  color: var(--muted);
  text-align: center;
}
/* Keeps its height when empty, so the face does not jump when a hint comes and goes. */
.toast-status {
  min-height: 48px;
  margin: 0;
}
.toast {
  display: inline-block;
  padding: 12px 22px;
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
  .toast-status {
    min-height: 42px;
  }
  .toast {
    font-size: 17px;
    padding: 10px 18px;
  }
}
</style>
