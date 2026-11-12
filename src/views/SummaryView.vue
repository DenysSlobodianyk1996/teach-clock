<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ClockFace from '@/components/ClockFace.vue'
import NumberFace from '@/components/NumberFace.vue'
import ProgressDots from '@/components/ProgressDots.vue'
import SummaryConfetti from '@/components/SummaryConfetti.vue'
import { formatClockTime } from '@/game/clockTime'
import { neighbours, shownNeighbours, tileValue } from '@/game/dragNumbers'
import { isNumbersSummary, type WrongTask } from '@/game/summary'
import { usePlayerStore } from '@/stores/player'
import { usePlayStore } from '@/stores/play'

/** The read-only review at the end of a Round: what was right, and what to practise. */
const { t } = useI18n()
const router = useRouter()
const play = usePlayStore()
const player = usePlayerStore()

// The router only opens this screen for a finished Round. A Summary never changes, so keep this
// one even while "Play again" replaces the Round under it.
const summary = play.summary
/** Set for a drag Game: it says what each tile shows. */
const numbersGame = summary && isNumbersSummary(summary) ? summary.game : null
/** What tile N shows. */
const value = (n: number) => (numbersGame ? tileValue(numbersGame, n) : n)
/** "N goes between…", for tile N. */
const between = (n: number) =>
  t('numbers.between', {
    ...(numbersGame ? shownNeighbours(numbersGame, neighbours(n)) : neighbours(n)),
  })

const headline = computed(() => {
  if (!summary) return ''
  const counts = { right: summary.rightCount, total: summary.total }
  // In Teach every number ends in its place, so "in their places" is only true of Test.
  const numbersTest = isNumbersSummary(summary) && summary.mode === 'test'
  return t(numbersTest ? 'summary.numbersHeadline' : 'summary.headline', counts)
})

const details = computed(() => {
  if (!summary) return ''
  const parts = [
    t('summary.cheer', { name: player.name }),
    t(`games.${summary.game}.name`),
    t(`modes.${summary.mode}.name`),
  ]
  if (summary.level !== null) parts.push(t(`levels.${summary.level}.name`))
  return parts.join(' · ')
})

/** "First try" in Teach, where the Player fixed it; "Your answer" in Test. */
const caption = computed(() =>
  t(summary?.mode === 'teach' ? 'summary.firstTry' : 'summary.yourAnswer'),
)

const nudge = computed(() => {
  const level = summary?.nudge?.level
  return level ? t('summary.tryLevel', { level: t(`levels.${level}.name`) }) : t('summary.tryOther')
})

function clockPair({ answer, firstAnswer }: WrongTask) {
  return t('summary.pair', {
    caption: caption.value,
    first: formatClockTime(firstAnswer),
    answer: formatClockTime(answer),
  })
}

function numberPair({ answer, firstAnswer }: WrongTask<number>) {
  const first = t('summary.numberFirst', {
    caption: caption.value,
    number: value(answer),
    slot: firstAnswer,
  })
  return `${first}. ${between(answer)}`
}

/** A drag Game in Test: the Player's face against the correct one. */
const faces = computed(() => {
  if (!summary || !isNumbersSummary(summary) || summary.mode !== 'test') return null
  const misplaced = summary.wrong.map((w) => w.answer)
  return {
    game: summary.game,
    placements: summary.placements,
    // The slots where a number does not belong.
    marked: summary.wrong.map((w) => w.firstAnswer),
    misplaced,
    correct: Array.from({ length: 12 }, (_, i) => i + 1),
    label: t('summary.yourFaceLabel', { numbers: misplaced.map(value).join(', ') }),
  }
})

/** A face with one number on one slot. */
function only(number: number, slot: number) {
  return Array.from({ length: 12 }, (_, i) => (i === slot - 1 ? number : null))
}

function playAgain() {
  play.startRound()
  router.push({ name: 'round' })
}

function toSettings() {
  play.leaveRound()
  router.push({ name: 'settings' })
}
</script>

<template>
  <div v-if="summary" class="summary">
    <SummaryConfetti />
    <header class="top">
      <p class="details">{{ details }}</p>
      <h1>{{ headline }}</h1>
      <ProgressDots :statuses="summary.statuses" :label="headline" />
    </header>

    <div v-if="faces" class="faces">
      <figure class="card face-card">
        <figcaption>{{ t('summary.yourFace') }}</figcaption>
        <NumberFace
          :game="faces.game"
          class="big-face"
          :slots="faces.placements"
          :marked="faces.marked"
          :label="faces.misplaced.length ? faces.label : t('summary.yourFace')"
        />
        <p v-if="faces.misplaced.length" class="face-note">{{ t('summary.misplacedNote') }}</p>
      </figure>
      <figure class="card face-card">
        <figcaption>{{ t('summary.correctFace') }}</figcaption>
        <NumberFace
          :game="faces.game"
          class="big-face"
          :slots="faces.correct"
          :good="faces.misplaced"
          :label="t('summary.correctFaceLabel')"
        />
        <ul v-if="faces.misplaced.length" class="face-note">
          <li v-for="n in faces.misplaced" :key="n">
            {{ between(n) }}
          </li>
        </ul>
      </figure>
      <p v-if="!summary.wrong.length" class="perfect-note wide">
        {{ t('summary.perfect') }} {{ nudge }}
      </p>
    </div>

    <div v-else class="groups" :class="{ perfect: !summary.wrong.length }">
      <section class="card group" aria-labelledby="right-title">
        <h2 id="right-title">
          <span class="dot ok" />{{ t('summary.right') }} · {{ summary.rightCount }}
        </h2>
        <p v-if="!summary.right.length" class="none">{{ t('summary.none') }}</p>
        <ul v-else-if="isNumbersSummary(summary)" class="chips">
          <li v-for="n in summary.right" :key="n" class="chip">{{ value(n) }}</li>
        </ul>
        <ul v-else class="right-clocks">
          <li v-for="time in summary.right" :key="formatClockTime(time)">
            <ClockFace class="small" :time="time" aria-hidden="true" />
            <span>{{ formatClockTime(time) }}</span>
          </li>
        </ul>
      </section>

      <section v-if="summary.wrong.length" class="card group wrong" aria-labelledby="wrong-title">
        <h2 id="wrong-title">
          <span class="dot bad" />{{ t('summary.wrong') }} · {{ summary.wrong.length }}
        </h2>
        <ul v-if="isNumbersSummary(summary)" class="pairs">
          <li v-for="task in summary.wrong" :key="task.answer" class="pair">
            <!-- The pictures are hidden from screen readers; this says the same in words. -->
            <span class="sr-only">{{ numberPair(task) }}</span>
            <div class="side" aria-hidden="true">
              <NumberFace
                :game="summary.game"
                class="pair-clock"
                :slots="only(task.answer, task.firstAnswer)"
                :marked="[task.firstAnswer]"
                label=""
              />
              <span class="caption">{{ caption }}</span>
            </div>
            <svg class="arrow" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
            <div class="side" aria-hidden="true">
              <NumberFace
                :game="summary.game"
                class="pair-clock"
                :slots="only(task.answer, task.answer)"
                label=""
              />
              <span class="caption good">{{ between(task.answer) }}</span>
            </div>
          </li>
        </ul>
        <ul v-else class="pairs">
          <li v-for="task in summary.wrong" :key="formatClockTime(task.answer)" class="pair">
            <span class="sr-only">{{ clockPair(task) }}</span>
            <div class="side" aria-hidden="true">
              <ClockFace class="pair-clock" :time="task.firstAnswer" />
              <span class="caption">{{ caption }}</span>
              <s class="time">{{ formatClockTime(task.firstAnswer) }}</s>
            </div>
            <svg class="arrow" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
            <div class="side" aria-hidden="true">
              <ClockFace class="pair-clock" :time="task.answer" />
              <span class="caption">{{ t('summary.right') }}</span>
              <b class="time good">{{ formatClockTime(task.answer) }}</b>
            </div>
          </li>
        </ul>
      </section>

      <p v-else class="perfect-note">{{ t('summary.perfect') }} {{ nudge }}</p>
    </div>

    <div class="actions">
      <button class="btn" type="button" @click="playAgain">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.6"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M4 12a8 8 0 1 0 2.5-5.8" />
          <path d="M4 4v4h4" />
        </svg>
        {{ t('summary.playAgain') }}
      </button>
      <button class="btn btn-soft" type="button" @click="toSettings">
        {{ t('summary.toSettings') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.summary {
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 16px clamp(20px, 4.4cqi, 44px) 28px;
}
.top {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}
.details {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: var(--muted);
}
h1 {
  margin: 0;
  font-size: clamp(32px, 5cqi, 52px);
  font-weight: 900;
  line-height: 1;
}
.faces {
  position: relative;
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
  align-content: start;
}
.face-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 0;
  padding: 18px;
}
.face-card figcaption {
  font-size: 20px;
  font-weight: 900;
}
.big-face {
  width: min(100%, 330px);
  height: auto;
  aspect-ratio: 1;
}
.face-note {
  margin: 0;
  padding: 0;
  font-size: 16px;
  color: var(--muted);
  text-align: center;
  list-style: none;
}
.perfect-note.wide {
  grid-column: 1 / -1;
}
.groups {
  position: relative;
  flex-grow: 1;
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
  gap: 22px;
  align-items: start;
  align-content: start;
}
.groups.perfect {
  grid-template-columns: 1fr;
}
.card {
  border-radius: 28px;
  background: var(--surface);
}
.group {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 20px;
}
.group.wrong {
  background: transparent;
  border: 3px solid var(--surface);
}
h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 22px;
  font-weight: 900;
}
.dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}
.dot.ok {
  background: var(--good);
}
.dot.bad {
  background: var(--bad);
}
ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
.right-clocks {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(128px, 1fr));
  gap: 14px 8px;
}
.right-clocks li {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 18px;
  font-weight: 900;
}
.small {
  width: 128px;
  height: 128px;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.chip {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--accent);
  color: var(--accent-ink);
  font-size: 22px;
  font-weight: 900;
}
.pairs {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.pair {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 14px;
  padding: 14px;
  border-radius: 22px;
  background: var(--surface);
}
/* Each side: the clock, then its caption and time under it. */
.side {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  text-align: center;
}
.pair-clock {
  flex: none;
  width: 140px;
  height: 140px;
  margin-bottom: 6px;
}
.caption {
  font-size: 15px;
  font-weight: 800;
  color: var(--muted);
}
.time {
  font-size: 22px;
  font-weight: 900;
}
s.time {
  text-decoration-thickness: 3px;
  text-decoration-color: var(--bad);
}
.good {
  color: var(--good-text);
}
.arrow {
  flex: none;
  width: 26px;
  height: 26px;
  fill: none;
  stroke: var(--muted);
  stroke-width: 2.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
.none {
  margin: 0;
  color: var(--muted);
}
.perfect-note {
  margin: 0;
  padding: 14px;
  border: 3px dashed var(--line);
  border-radius: 22px;
  color: var(--muted);
  font-size: 18px;
  text-align: center;
}
.actions {
  position: relative;
  display: flex;
  justify-content: center;
  gap: 16px;
}
@media (--phone) {
  .summary {
    padding: 8px 20px 24px;
  }
  .details {
    font-size: 15px;
  }
  .groups,
  .faces {
    grid-template-columns: 1fr;
  }
  /* Stacked: the Player's answer on top, a down arrow, then the correct one. */
  .pair {
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
    padding: 12px 14px;
  }
  /* Under the middle of the clocks. */
  .pair .arrow {
    align-self: flex-start;
    margin-left: calc((120px - 26px) / 2);
    transform: rotate(90deg);
  }
  /* Beside the clock now: caption on top, time under it. */
  .side {
    flex: none;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    grid-template-rows: auto auto;
    column-gap: 12px;
    align-items: center;
    text-align: start;
  }
  .pair-clock {
    grid-row: span 2;
    width: 120px;
    height: 120px;
    margin-bottom: 0;
  }
  .caption {
    align-self: end;
  }
  /* Drag Hours has no time under the caption. */
  .caption:last-child {
    grid-row: span 2;
    align-self: center;
  }
  .time {
    align-self: start;
  }
  .right-clocks {
    grid-template-columns: repeat(auto-fill, minmax(116px, 1fr));
  }
  .small {
    width: 108px;
    height: 108px;
  }
  .actions {
    flex-direction: column;
  }
}
</style>
