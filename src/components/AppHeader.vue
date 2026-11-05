<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BrandMark from './BrandMark.vue'
import LeaveRoundDialog from './LeaveRoundDialog.vue'
import { usePlayStore } from '@/stores/play'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const play = usePlayStore()

const inRound = computed(() => route.name === 'round')
const showHome = computed(() => route.name === 'settings')

const leaveButton = ref<HTMLButtonElement>()

async function stay() {
  play.askingToLeave = false
  await nextTick()
  leaveButton.value?.focus()
}

function leaveRound() {
  play.leaveRound()
  router.push({ name: 'settings' })
}
</script>

<template>
  <header class="hdr">
    <div class="brand">
      <BrandMark class="brand-mark" />
      <span class="brand-name">{{ t('app.name') }}</span>
    </div>
    <div class="hdr-tools">
      <RouterLink
        v-if="showHome"
        class="icon-btn"
        :to="{ name: 'welcome' }"
        :aria-label="t('header.home')"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.4"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M3 11l9-7 9 7" />
          <path d="M5 10v10h14V10" />
        </svg>
      </RouterLink>
      <button
        v-if="inRound"
        ref="leaveButton"
        class="icon-btn"
        type="button"
        @click="play.askingToLeave = true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.4"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M14 4h5v16h-5" />
          <path d="M9 8l-4 4 4 4" />
          <path d="M5 12h11" />
        </svg>
        {{ t('header.leave') }}
      </button>
    </div>
    <LeaveRoundDialog v-if="inRound && play.askingToLeave" @stay="stay" @leave="leaveRound" />
  </header>
</template>

<style scoped>
.hdr {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: var(--header-height);
  padding: 0 20px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 900;
  font-size: 22px;
  letter-spacing: 0.2px;
}
.brand-mark {
  width: 36px;
  height: 36px;
}
.hdr-tools {
  display: flex;
  align-items: center;
  gap: 10px;
}
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 48px;
  min-width: 48px;
  padding: 0 16px;
  border: 2px solid var(--line);
  border-radius: 999px;
  background: transparent;
  color: var(--text);
  font:
    800 16px 'Nunito',
    sans-serif;
  text-decoration: none;
  cursor: pointer;
}
.icon-btn svg {
  width: 22px;
  height: 22px;
}

@media (min-width: 1100px) {
  .hdr {
    padding: 0 40px;
  }
}
@media (max-width: 600px), (max-height: 500px) {
  .hdr {
    padding: 0 14px;
  }
  .brand {
    font-size: 18px;
  }
}
</style>
