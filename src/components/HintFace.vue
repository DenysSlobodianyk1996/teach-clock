<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import NumberFace from './NumberFace.vue'
import { hintSlots, neighbours, shownNeighbours, type TileSet } from '@/game/dragNumbers'

/**
 * The Hint for the drag Games: a small face with the number's own slot lit
 * in green, and its two neighbours on theirs, so the Player sees where it goes. `number` is a slot
 * id 1–12; the face shows the tiles as the Round does (minutes, 13–24, Hour Badges).
 */
const props = defineProps<{ tiles: TileSet; number: number }>()

const { t } = useI18n()

const slots = computed(() => hintSlots(props.number))
const label = computed(() =>
  t('numbers.between', { ...shownNeighbours(props.tiles, neighbours(props.number)) }),
)
</script>

<template>
  <NumberFace
    class="small-face"
    :tiles="tiles"
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
