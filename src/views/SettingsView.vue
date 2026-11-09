<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ChoiceCard from '@/components/ChoiceCard.vue'
import { GAMES, LEVELS, MODES, hasLevel } from '@/game/settings'
import { usePlayerStore } from '@/stores/player'
import { usePlayStore } from '@/stores/play'

const { t } = useI18n()
const router = useRouter()
const player = usePlayerStore()
const play = usePlayStore()

const showLevel = computed(() => hasLevel(play.settings.game))

function startRound() {
  play.startRound()
  router.push({ name: 'round' })
}
</script>

<template>
  <div class="settings">
    <h1>{{ t('settings.greeting', { name: player.name }) }}</h1>

    <fieldset class="group">
      <legend class="label">{{ t('settings.game') }}</legend>
      <div class="row games">
        <ChoiceCard
          v-for="game in GAMES"
          :key="game"
          :title="t(`games.${game}.name`)"
          :description="t(`games.${game}.description`)"
          name="game"
          :checked="play.settings.game === game"
          @select="play.settings.game = game"
        >
          <template #icon>
            <svg viewBox="-100 -100 200 200" aria-hidden="true">
              <circle class="c-face" r="90" />
              <template v-if="game === 'dragNumbers'">
                <circle class="c-slot" cx="0" cy="-62" r="16" />
                <circle class="c-slot" cx="62" cy="0" r="16" />
                <circle class="c-slot" cx="0" cy="62" r="16" />
                <circle class="c-tile" cx="-62" cy="0" r="18" />
                <text class="c-tile-num" x="-62" y="0">9</text>
              </template>
              <template v-else-if="game === 'dragArrows'">
                <line class="c-hour" y1="8" y2="-42" transform="rotate(120)" />
                <line class="c-min" y1="10" y2="-64" />
                <circle class="c-grip" cx="0" cy="-64" r="14" />
                <circle class="c-pin" r="9" />
              </template>
              <text v-else class="c-num" x="0" y="2" style="font-size: 54px">4:15</text>
            </svg>
          </template>
        </ChoiceCard>
      </div>
    </fieldset>

    <fieldset class="group">
      <legend class="label">{{ t('settings.mode') }}</legend>
      <div class="row modes">
        <ChoiceCard
          v-for="mode in MODES"
          :key="mode"
          :title="t(`modes.${mode}.name`)"
          :description="t(`modes.${mode}.description`)"
          name="mode"
          :checked="play.settings.mode === mode"
          @select="play.settings.mode = mode"
        />
      </div>
    </fieldset>

    <fieldset v-if="showLevel" class="group">
      <legend class="label">{{ t('settings.level') }}</legend>
      <div class="row levels">
        <ChoiceCard
          v-for="level in LEVELS"
          :key="level"
          :title="t(`levels.${level}.name`)"
          :description="t(`levels.${level}.description`)"
          name="level"
          :checked="play.settings.level === level"
          @select="play.settings.level = level"
        />
      </div>
    </fieldset>

    <div class="spacer" />
    <div class="actions">
      <button class="btn btn-soft" type="button" @click="router.push({ name: 'welcome' })">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.6"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M15 5l-7 7 7 7" />
        </svg>
        {{ t('settings.back') }}
      </button>
      <button class="btn" type="button" @click="startRound">
        {{ t('settings.play') }}
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M8 5l11 7-11 7z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.settings {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 4px clamp(20px, 4.7cqi, 48px) 32px;
}
h1 {
  margin: 0;
  font-size: clamp(26px, 3.5cqi, 36px);
  font-weight: 900;
}
.group {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0;
  padding: 0;
  border: 0;
  min-width: 0;
}
.group legend {
  padding: 0;
  margin-bottom: 16px;
}
.row {
  display: grid;
  gap: 14px;
}
.games {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.modes {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.levels {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.spacer {
  flex-grow: 1;
}
.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

@media (--phone) {
  .settings {
    padding: 4px 20px 24px;
    gap: 12px;
  }
  .games {
    grid-template-columns: 1fr;
  }
  .levels :deep(.description) {
    display: none;
  }
  .levels :deep(.choice) {
    justify-content: center;
    padding: 12px 6px;
    text-align: center;
  }
  /* Back and Play share the row equally, so both fit a 360 px phone. */
  .actions .btn {
    flex: 1 1 0;
    min-width: 0;
    padding: 0 16px;
  }
}
</style>
