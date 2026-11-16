<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PopupDialog from './PopupDialog.vue'
import NumberFace from './NumberFace.vue'
import type { TileSet } from '@/game/dragNumbers'

/**
 * Teach, the drag Games: the Filled Clock. A read-only face with every number on its own slot, drawn
 * as the Round draws it (1–12, 13–24 or minutes, Hour Badges and all). Got it, Escape and the scrim
 * emit `dismiss`; it changes nothing in the Round.
 */
defineProps<{ tiles: TileSet }>()
const emit = defineEmits<{ dismiss: [] }>()

const { t } = useI18n()

/** Slot N holds number N: the whole face, filled. */
const ALL_SLOTS = Array.from({ length: 12 }, (_, i) => i + 1)
</script>

<template>
  <PopupDialog labelledby="filled-title" wide @dismiss="emit('dismiss')">
    <h2 id="filled-title">{{ t('numbers.filledTitle') }}</h2>
    <NumberFace
      class="filled-face"
      :tiles="tiles"
      :slots="ALL_SLOTS"
      :label="t('numbers.filledFace')"
    />
    <button class="btn got-it" type="button" data-autofocus @click="emit('dismiss')">
      {{ t('teach.gotIt') }}
    </button>
  </PopupDialog>
</template>

<style scoped>
/* As big as fits, with the board's shadow, so it reads like the clock in play. */
.filled-face {
  width: min(320px, 72vw, 52vh);
  height: auto;
  aspect-ratio: 1;
  filter: drop-shadow(0 8px 0 rgba(0, 0, 0, 0.14));
}
.got-it {
  width: min(300px, 100%);
}
</style>
