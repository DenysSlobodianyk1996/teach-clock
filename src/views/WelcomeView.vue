<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { NAME_MAX_LENGTH, usePlayerStore } from '@/stores/player'

const { t } = useI18n()
const router = useRouter()
const player = usePlayerStore()

const draft = ref(player.name)
const canStart = computed(() => draft.value.trim() !== '')

function start() {
  if (!canStart.value) return
  player.setName(draft.value)
  router.push({ name: 'settings' })
}

// Welcome art: a clock at 10:10. Number positions on a circle of radius 66.
const numbers = Array.from({ length: 12 }, (_, i) => {
  const n = i + 1
  const a = (n * Math.PI) / 6
  return { n, x: +(66 * Math.sin(a)).toFixed(1), y: +(-66 * Math.cos(a)).toFixed(1) }
})
</script>

<template>
  <div class="welcome">
    <form class="intro" @submit.prevent="start">
      <h1>{{ t('welcome.title') }}</h1>
      <p class="lead">{{ t('welcome.intro') }}</p>
      <div class="name">
        <label class="label" for="player-name">{{ t('welcome.nameLabel') }}</label>
        <input
          id="player-name"
          v-model="draft"
          class="field"
          type="text"
          :maxlength="NAME_MAX_LENGTH"
          autocomplete="given-name"
          :placeholder="t('welcome.namePlaceholder')"
        />
      </div>
      <div class="actions">
        <button class="btn" type="submit" :disabled="!canStart">
          {{ t('welcome.start') }}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.6"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </form>

    <div class="art" aria-hidden="true">
      <svg class="confetti" viewBox="0 0 400 400">
        <circle cx="60" cy="70" r="10" fill="var(--accent)" />
        <circle cx="352" cy="110" r="7" fill="var(--hour)" />
        <rect
          x="330"
          y="300"
          width="18"
          height="18"
          rx="5"
          transform="rotate(20 339 309)"
          fill="var(--good)"
        />
        <rect
          x="40"
          y="300"
          width="14"
          height="14"
          rx="4"
          transform="rotate(-15 47 307)"
          fill="var(--face)"
        />
      </svg>
      <svg class="clock" viewBox="-100 -100 200 200">
        <circle class="c-face" r="94" />
        <circle class="c-tick" r="84" stroke-dasharray="1.2 7.5965" stroke-dashoffset="0.6" />
        <circle class="c-tick5" r="84" stroke-dasharray="3 40.982" stroke-dashoffset="1.5" />
        <text v-for="p in numbers" :key="p.n" class="c-num" :x="p.x" :y="p.y">{{ p.n }}</text>
        <line class="c-hour" y1="10" y2="-45" transform="rotate(305)" />
        <line class="c-min" y1="14" y2="-70" transform="rotate(60)" />
        <circle class="c-pin" r="7" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.welcome {
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 40px;
  align-items: center;
  padding: 0 clamp(24px, 6cqi, 64px) 40px;
}
.intro {
  display: flex;
  flex-direction: column;
  gap: 22px;
}
h1 {
  margin: 0;
  font-size: clamp(32px, 4.7cqi, 48px);
  font-weight: 900;
  line-height: 1.08;
}
.lead {
  margin: 0;
  font-size: clamp(17px, 2cqi, 20px);
  line-height: 1.45;
  color: var(--muted);
}
.name {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 6px;
}
.art {
  position: relative;
  display: flex;
  justify-content: center;
}
.confetti {
  position: absolute;
  width: 115%;
  top: -5%;
}
.clock {
  position: relative;
  width: min(100%, 380px);
  aspect-ratio: 1;
  overflow: visible;
  filter: drop-shadow(0 8px 0 rgba(0, 0, 0, 0.14));
}

@media (max-width: 600px), (max-height: 500px) {
  .welcome {
    grid-template-columns: 1fr;
    align-content: start;
    gap: 18px;
    padding: 8px 20px 28px;
  }
  .art {
    order: -1;
  }
  .confetti {
    display: none;
  }
  .clock {
    width: 230px;
  }
  .intro {
    gap: 18px;
  }
  .actions .btn {
    width: 100%;
  }
}
</style>
