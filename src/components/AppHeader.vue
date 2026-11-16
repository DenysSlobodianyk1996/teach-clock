<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import HeaderBar from './HeaderBar.vue'
import LeaveRoundDialog from './LeaveRoundDialog.vue'
import PreferenceSwitches from './PreferenceSwitches.vue'
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
  <HeaderBar :crowded="showHome || inRound">
    <PreferenceSwitches />
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
      <span class="leave-label">{{ t('header.leave') }}</span>
    </button>
    <LeaveRoundDialog v-if="inRound && play.askingToLeave" @stay="stay" @leave="leaveRound" />
  </HeaderBar>
</template>

<style scoped>
/* Phones: room only for icons, as in the design. Names stay for screen readers. */
@media (--phone) {
  .leave-label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }
  .icon-btn {
    padding: 0;
    width: 48px;
  }
}
</style>
