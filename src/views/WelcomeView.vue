<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { NAME_MAX_LENGTH, usePlayerStore } from '@/stores/player'
import InfoButton from '@/components/InfoButton.vue'
import InfoPopup from '@/components/InfoPopup.vue'

const { t } = useI18n()
const router = useRouter()
const player = usePlayerStore()

const draft = ref(player.name)
/** On a phone the intro is behind the ⓘ, in an Info Popup. */
const infoOpen = ref(false)
/** The heading split before its last word, which the ⓘ keeps company on a phone. */
const title = computed(() => {
  const text = t('welcome.title')
  const at = text.lastIndexOf(' ')
  return { head: text.slice(0, at + 1), last: text.slice(at + 1) }
})
const nameField = ref<HTMLInputElement | null>(null)
/** Start was tried with no name; the first typed letter clears it. */
const nameMissing = ref(false)

function start() {
  if (draft.value.trim() === '') {
    nameMissing.value = true
    // In the tap itself, so a phone opens its keyboard.
    nameField.value?.focus()
    return
  }
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
    <form class="intro" novalidate @submit.prevent="start">
      <div class="heading">
        <h1>
          {{ title.head }}<span class="last">{{ title.last }}</span>
        </h1>
        <InfoButton @click="infoOpen = true" />
      </div>
      <p class="lead">{{ t('welcome.intro') }}</p>
      <div class="name">
        <label class="label" for="player-name">
          {{ t('welcome.nameLabel') }}<span class="required-mark" aria-hidden="true"> *</span>
        </label>
        <input
          id="player-name"
          ref="nameField"
          v-model="draft"
          class="field"
          type="text"
          :maxlength="NAME_MAX_LENGTH"
          autocomplete="given-name"
          :placeholder="t('welcome.namePlaceholder')"
          required
          :aria-invalid="nameMissing || undefined"
          :aria-describedby="nameMissing ? 'player-name-error' : undefined"
          @input="nameMissing = false"
        />
        <p v-if="nameMissing" id="player-name-error" class="name-error" role="alert">
          {{ t('welcome.nameRequired') }}
        </p>
      </div>
      <div class="actions">
        <button class="btn" type="submit">
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

    <InfoPopup
      v-if="infoOpen"
      :heading="t('app.name')"
      :text="t('welcome.intro')"
      @dismiss="infoOpen = false"
    />
  </div>
</template>

<style scoped>
.welcome {
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 40px;
  align-items: center;
  padding: 0 clamp(24px, 6vw, 64px) 40px;
  padding: 0 clamp(24px, 6cqi, 64px) 40px;
}
.intro {
  display: flex;
  flex-direction: column;
  gap: 22px;
}
h1 {
  margin: 0;
  font-size: clamp(32px, 4.7vw, 48px);
  font-size: clamp(32px, 4.7cqi, 48px);
  font-weight: 900;
  line-height: 1.08;
}
.lead {
  margin: 0;
  font-size: clamp(17px, 2vw, 20px);
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
.required-mark {
  color: var(--bad-text);
}
.field[aria-invalid='true'] {
  border-color: var(--bad);
}
.name-error {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  line-height: 1.2;
  color: var(--bad-text);
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

@media (--phone) {
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
  .intro {
    gap: 18px;
    flex: none;
  }
  /* The ⓘ follows the heading's last word and never wraps away from it: the word keeps a gap
     the ⓘ's width after it, and the ⓘ is pulled back over that gap. The block shares the heading's
     font, so the ⓘ's `vertical-align: middle` centres it on the heading's letters, not on the
     body text's (4 px lower, batch 25). */
  .heading {
    font-size: clamp(32px, 4.7vw, 48px);
    font-size: clamp(32px, 4.7cqi, 48px);
    font-weight: 900;
    line-height: 1.08;
  }
  .heading h1 {
    display: inline;
  }
  .last {
    white-space: nowrap;
  }
  .last::after {
    content: '';
    display: inline-block;
    width: 48px;
  }
  .heading :deep(.info-btn) {
    margin: -8px 0 -8px -46px;
    vertical-align: middle;
  }
  /* The intro is read in the Info Popup instead. */
  .lead {
    display: none;
  }
  .actions .btn {
    width: 100%;
  }
  /* The message sits in the gaps around it, so it fits where the clock is already at its floor. */
  .name-error {
    margin: -5px 0 -6px;
  }

  /* Start without scrolling. The view fills <main>; the clock takes the height left, from about
     100 px up to the column's width, so a tall screen gets a big clock. What is still left is shared
     above and below by auto margins, which, unlike centring, keep the top reachable when the rest
     needs more than <main> has (big text, a sideways phone): then <main> scrolls, never the page.
     The column is full width in every language. No height breakpoint, so a keyboard that shrinks the
     page only shrinks the clock towards its floor; it never flips to another layout mid-typing. */
  .welcome {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
  }
  .art {
    margin-top: auto;
  }
  .intro {
    margin-bottom: auto;
  }
  .art {
    flex: 1 1 0;
    min-height: 100px;
    max-height: calc(100vw - 40px);
    max-height: calc(100cqi - 40px);
    container-type: size;
    align-items: center;
  }
  /* Old Android WebViews lack container units; there the clock keeps its width above. */
  @supports (width: 1cqw) {
    .art .clock {
      width: min(100cqw, 100cqh);
    }
  }
}
</style>
