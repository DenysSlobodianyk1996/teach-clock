<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ChoiceCard from '@/components/ChoiceCard.vue'
import InfoButton from '@/components/InfoButton.vue'
import InfoPopup from '@/components/InfoPopup.vue'
import ModeIcon from '@/components/ModeIcon.vue'
import { GAMES, HOURS, LEVELS, MODES, hasHours, hasLevel } from '@/game/settings'
import { usePlayerStore } from '@/stores/player'
import { usePlayStore } from '@/stores/play'

const { t } = useI18n()
const router = useRouter()
const player = usePlayerStore()
const play = usePlayStore()

const showLevel = computed(() => hasLevel(play.settings.game))
const showHours = computed(() => hasHours(play.settings.game))
/** Drag Hours says which numbers it places: 1–12 or 13–24, as Hours is picked. */
const hoursRange = computed(() => t(`hours.${play.settings.hours}.name`))
const gameDescription = (game: (typeof GAMES)[number]) =>
  t(`games.${game}.description`, { range: hoursRange.value })

/** On a phone the cards show no descriptions: the Game and Mode ones are behind an ⓘ. */
const info = ref<'game' | 'mode' | null>(null)
const infoPopup = computed(() =>
  info.value === 'game'
    ? {
        heading: t('settings.game'),
        items: GAMES.map((g) => ({ name: t(`games.${g}.name`), description: gameDescription(g) })),
      }
    : info.value === 'mode'
      ? {
          heading: t('settings.mode'),
          items: MODES.map((m) => ({
            name: t(`modes.${m}.name`),
            description: t(`modes.${m}.description`),
          })),
        }
      : null,
)
/** The section names, so a group is named by its heading alone, not by its ⓘ too. */
const id = useId()

function startRound() {
  play.startRound()
  router.push({ name: 'round' })
}
</script>

<template>
  <div class="settings">
    <h1>{{ t('settings.greeting', { name: player.name }) }}</h1>

    <fieldset class="group" :aria-labelledby="`${id}-game`">
      <legend class="label">
        <span :id="`${id}-game`">{{ t('settings.game') }}</span>
        <InfoButton :about="t('settings.game')" @click="info = 'game'" />
      </legend>
      <div class="row games">
        <ChoiceCard
          v-for="game in GAMES"
          :key="game"
          :title="t(`games.${game}.name`)"
          :description="gameDescription(game)"
          name="game"
          :checked="play.settings.game === game"
          @select="play.settings.game = game"
        >
          <template #icon>
            <svg class="c-icon" viewBox="-100 -100 200 200" aria-hidden="true">
              <circle class="c-face" r="90" />
              <template v-if="game === 'dragHours'">
                <circle class="c-slot" cx="0" cy="-62" r="16" />
                <circle class="c-slot" cx="62" cy="0" r="16" />
                <circle class="c-slot" cx="0" cy="62" r="16" />
                <circle class="c-tile" cx="-62" cy="0" r="18" />
                <text class="c-tile-num" x="-62" y="0">9</text>
              </template>
              <!-- Drag Minutes: big minute tiles, 5 by the 1 and 30 at the 6, set apart from the
                   single hour tile of Drag Hours. -->
              <template v-else-if="game === 'dragMinutes'">
                <circle class="c-slot" cx="-60" cy="-8" r="16" />
                <circle class="c-tile" cx="28" cy="-48" r="32" />
                <text class="c-tile-num icon-tile" x="28" y="-48">5</text>
                <circle class="c-tile" cx="0" cy="56" r="32" />
                <text class="c-tile-num icon-tile" x="0" y="56">30</text>
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

    <fieldset class="group" :aria-labelledby="`${id}-mode`">
      <legend class="label">
        <span :id="`${id}-mode`">{{ t('settings.mode') }}</span>
        <InfoButton :about="t('settings.mode')" @click="info = 'mode'" />
      </legend>
      <div class="row modes">
        <ChoiceCard
          v-for="mode in MODES"
          :key="mode"
          :title="t(`modes.${mode}.name`)"
          :description="t(`modes.${mode}.description`)"
          name="mode"
          :checked="play.settings.mode === mode"
          @select="play.settings.mode = mode"
        >
          <template #icon>
            <ModeIcon :mode="mode" />
          </template>
        </ChoiceCard>
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

    <fieldset v-if="showHours" class="group">
      <legend class="label">{{ t('settings.hours') }}</legend>
      <div class="row hours">
        <ChoiceCard
          v-for="hours in HOURS"
          :key="hours"
          :title="t(`hours.${hours}.name`)"
          :description="t(`hours.${hours}.description`)"
          name="hours"
          :checked="play.settings.hours === hours"
          @select="play.settings.hours = hours"
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

    <InfoPopup
      v-if="infoPopup"
      :heading="infoPopup.heading"
      :items="infoPopup.items"
      @dismiss="info = null"
    />
  </div>
</template>

<style scoped>
.settings {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 4px clamp(20px, 4.7vw, 48px) 32px;
  padding: 4px clamp(20px, 4.7cqi, 48px) 32px;
}
h1 {
  margin: 0;
  font-size: clamp(26px, 3.5vw, 36px);
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
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
.icon-tile {
  font-size: 36px;
}
.modes {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.levels {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.hours {
  grid-template-columns: repeat(2, minmax(0, 1fr));
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

.group legend {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Four Game cards need about 1100 px to keep their titles whole. */
@media (max-width: 1100px) {
  .games {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (--phone) {
  .settings {
    padding: 4px 20px 24px;
    gap: 12px;
  }
  /* Back and Play follow the last section with the usual gap, not pinned to the screen's bottom,
     so a tall screen shows no empty band between the cards and the buttons. The block sits in the
     middle of the room left (auto margins, which keep the greeting reachable if <main> must scroll);
     on a small phone it fills it anyway. */
  .settings > h1 {
    margin-top: auto;
  }
  .settings > .actions {
    margin-bottom: auto;
  }
  .spacer {
    display: none;
  }
  /* The greeting stays, smaller, to leave room for the cards. */
  h1 {
    font-size: 22px;
  }
  .group,
  .group legend {
    gap: 8px;
  }
  .group legend {
    margin-bottom: 8px;
  }
  /* The ⓘ is a 44 px target but takes no more height than the heading's line. */
  .group legend :deep(.info-btn) {
    margin: -12px 0;
  }
  .row {
    gap: 10px;
  }
  /* No descriptions on a phone: the Game and Mode ones are in the Info Popups. */
  .row :deep(.description) {
    display: none;
  }
  /* Two by two: Drag Hours and Drag Minutes share the first row. */
  .games {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  /* Compact cards: a small icon beside the title. */
  .games :deep(.choice),
  .modes :deep(.choice) {
    gap: 10px;
    min-height: 60px;
    padding: 8px 10px;
    border-radius: 18px;
  }
  .games :deep(.choice svg),
  .modes :deep(.choice svg) {
    width: 36px;
    height: 36px;
  }
  .games :deep(.choice b),
  .modes :deep(.choice b) {
    font-size: 17px;
    line-height: 1.15;
  }
  /* A very narrow phone (320 px): a smaller icon and title, so "Перевірка" or "Розстав хвилини"
     still fit beside the icon. */
  @media (max-width: 340px) {
    .games :deep(.choice),
    .modes :deep(.choice) {
      gap: 6px;
      padding: 8px;
    }
    .games :deep(.choice svg),
    .modes :deep(.choice svg) {
      width: 28px;
      height: 28px;
    }
    .games :deep(.choice b),
    .modes :deep(.choice b) {
      font-size: 15px;
    }
  }
  .levels :deep(.choice),
  .hours :deep(.choice) {
    justify-content: center;
    padding: 8px 6px;
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
