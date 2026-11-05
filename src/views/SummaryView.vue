<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { formatClockTime } from '@/game/clockTime'
import { usePlayStore } from '@/stores/play'

/** Read-only Summary as text. Clocks and the celebration come with ticket 09. */
const { t } = useI18n()
const router = useRouter()
const play = usePlayStore()

// The router only opens this screen for a finished Round. A Summary never changes, so keep this
// one even while "Play again" replaces the Round under it.
const summary = play.summary

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
    <h1>{{ t('summary.headline', { right: summary.rightCount, total: summary.total }) }}</h1>
    <div class="lists">
      <section class="list" aria-labelledby="right-title">
        <h2 id="right-title"><span class="dot ok" />{{ t('summary.right') }}</h2>
        <ul v-if="summary.right.length">
          <li v-for="time in summary.right" :key="formatClockTime(time)">
            <b>{{ formatClockTime(time) }}</b>
          </li>
        </ul>
        <p v-else class="none">{{ t('summary.none') }}</p>
      </section>
      <section class="list" aria-labelledby="wrong-title">
        <h2 id="wrong-title"><span class="dot bad" />{{ t('summary.wrong') }}</h2>
        <ul v-if="summary.wrong.length">
          <li v-for="{ answer, firstAnswer } in summary.wrong" :key="formatClockTime(answer)">
            <b>{{ formatClockTime(answer) }}</b> —
            {{ t('summary.yourAnswer', { time: formatClockTime(firstAnswer) }) }}
          </li>
        </ul>
        <p v-else class="none">{{ t('summary.none') }}</p>
      </section>
    </div>
    <div class="actions">
      <button class="btn btn-soft" type="button" @click="toSettings">
        {{ t('summary.toSettings') }}
      </button>
      <button class="btn" type="button" @click="playAgain">{{ t('summary.playAgain') }}</button>
    </div>
  </div>
</template>

<style scoped>
.summary {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px clamp(20px, 4.7cqi, 48px) 32px;
}
h1 {
  margin: 0;
  font-size: clamp(30px, 4cqi, 42px);
  font-weight: 900;
  text-align: center;
}
.lists {
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  align-items: start;
}
.list {
  padding: 18px 22px;
  border-radius: 28px;
  background: var(--surface);
}
h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 10px;
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
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 18px;
}
b {
  font-weight: 900;
}
.none {
  margin: 0;
  color: var(--muted);
}
.actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
@media (max-width: 600px), (max-height: 500px) {
  .summary {
    padding: 8px 20px 24px;
  }
  .lists {
    grid-template-columns: 1fr;
  }
  .actions {
    flex-direction: column-reverse;
  }
}
</style>
