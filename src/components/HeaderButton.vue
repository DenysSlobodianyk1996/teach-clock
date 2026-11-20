<script setup lang="ts">
/**
 * A tool in the header (batch 25): Home, Leave, the language and the theme all use it, so they look
 * and behave alike. A link when it has `to`, otherwise a button. With `circle` it is a 48 px circle;
 * Leave is round only on a phone, where its word is hidden.
 */
import { ref } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'

defineProps<{
  to?: RouteLocationRaw
  /** The name screen readers hear, when the button shows only an icon or a code. */
  label?: string
  circle?: boolean
}>()

const el = ref<HTMLElement | { $el: HTMLElement }>()

defineExpose({
  focus() {
    const target = el.value
    ;(target && '$el' in target ? target.$el : target)?.focus()
  },
})
</script>

<template>
  <RouterLink v-if="to" ref="el" class="icon-btn" :class="{ circle }" :to="to" :aria-label="label">
    <slot />
  </RouterLink>
  <button v-else ref="el" class="icon-btn" :class="{ circle }" type="button" :aria-label="label">
    <slot />
  </button>
</template>

<style scoped>
.circle {
  width: 48px;
  padding: 0;
}
</style>
