<script setup lang="ts">
/** One option of a single-choice group (a native radio styled as a card). */
defineProps<{ name: string; title: string; description: string; checked: boolean }>()
defineEmits<{ select: [] }>()
</script>

<template>
  <label class="choice" :class="{ checked }">
    <input class="radio" type="radio" :name="name" :checked="checked" @change="$emit('select')" />
    <span class="ring" aria-hidden="true"></span>
    <slot name="icon" />
    <span class="text">
      <b>{{ title }}</b>
      <span class="description">{{ description }}</span>
    </span>
  </label>
</template>

<style scoped>
.choice {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 48px;
  padding: 16px 18px;
  border-radius: 22px;
  border: 3px solid transparent;
  background: var(--surface);
  position: relative;
  color: var(--text);
  text-align: left;
  cursor: pointer;
}
/* The real radio is invisible and covers the card, so a tap anywhere picks it. */
.radio {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: pointer;
}
/* No :has() here: old Android WebViews lack it (docs/android-checks.md). The focus ring sits on a
   sibling of the radio, so only keyboard focus shows it, and the chosen card has a class. */
.ring {
  position: absolute;
  inset: -10px;
  border-radius: 29px;
  pointer-events: none;
}
.radio:focus-visible ~ .ring {
  outline: 4px solid var(--accent);
  outline-offset: -4px;
}
.choice.checked {
  border-color: var(--accent);
  background: var(--surface-2);
}
.choice :slotted(svg) {
  flex: none;
  width: 56px;
  height: 56px;
}
.text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
b {
  font-weight: 900;
  font-size: 19px;
}
.description {
  font-size: 14px;
  font-weight: 600;
  color: var(--muted);
  line-height: 1.3;
}
</style>
