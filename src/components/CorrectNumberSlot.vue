<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import NumberFace from './NumberFace.vue'
import { neighbours, shownNeighbours } from '@/game/dragNumbers'
import type { NumbersGame } from '@/game/round'

/**
 * The wrong-Answer popup's picture for the drag Games: a small face with the number's own slot lit
 * in green, and its two neighbours on theirs, so the Player sees where it goes. `number` is a slot
 * id 1–12; Drag Minutes shows minutes and its Hour Badges.
 */
const props = defineProps<{ game: NumbersGame; number: number }>()

const { t } = useI18n()

const around = computed(() => neighbours(props.number))
const slots = computed(() => {
  const { number, before, after } = around.value
  return Array.from({ length: 12 }, (_, i) =>
    [number, before, after].includes(i + 1) ? i + 1 : null,
  )
})
const label = computed(() => t('numbers.between', { ...shownNeighbours(props.game, around.value) }))
</script>

<template>
  <NumberFace
    class="small-face"
    :game="game"
    :slots="slots"
    :good="[number]"
    :label="label"
    small
  />
</template>

<style scoped>
.small-face {
  width: 180px;
  height: 180px;
}
@media (--phone-upright) {
  .small-face {
    width: 150px;
    height: 150px;
  }
}
</style>
