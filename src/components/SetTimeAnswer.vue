<script setup lang="ts">
import { computed, ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import NumberPad from './NumberPad.vue'
import type { ClockTime } from '@/game/clockTime'
import {
  canSubmit,
  clearBox,
  EMPTY_ENTRY,
  pressDigit,
  readEntry,
  selectBox,
  type Box,
  type TimeEntry,
} from '@/game/timeEntry'

/**
 * Hour and minute boxes, the number pad and Submit. Mount a fresh one per Task (`:key`).
 * Emits only a possible Clock Time; an impossible one shows an error and waits for a fix.
 */
const props = defineProps<{ disabled?: boolean }>()
const emit = defineEmits<{ submit: [time: ClockTime] }>()

const { t } = useI18n()

const root = ref<HTMLElement>()
const entry = ref<TimeEntry>(EMPTY_ENTRY)
const errors = ref<Box[]>([])
const ready = computed(() => canSubmit(entry.value))

function edit(next: TimeEntry) {
  entry.value = next
  errors.value = []
}

function select(box: Box) {
  entry.value = selectBox(entry.value, box)
}

/** What a box shows: a lone minute digit reads as 0X once the Player leaves it. */
function shown(box: Box): string {
  const value = entry.value[box]
  if (box === 'minute' && value.length === 1 && entry.value.selected !== 'minute')
    return `0${value}`
  return value
}

function submit() {
  if (!ready.value) return
  const result = readEntry(entry.value)
  if ('errors' in result) errors.value = result.errors
  else emit('submit', result.time)
}

useEventListener(window, 'keydown', (event: KeyboardEvent) => {
  if (props.disabled) return
  if (event.ctrlKey || event.metaKey || event.altKey) return
  if (/^[0-9]$/.test(event.key)) {
    edit(pressDigit(entry.value, Number(event.key)))
  } else if (event.key === 'Backspace' || event.key === 'Delete') {
    edit(clearBox(entry.value))
  } else if (event.key === 'ArrowLeft') {
    select('hour')
  } else if (event.key === 'ArrowRight') {
    select('minute')
  } else if (event.key === 'Enter') {
    // Enter on a button elsewhere (the header) keeps its own meaning; in this panel it submits.
    if (event.target instanceof HTMLButtonElement && !root.value?.contains(event.target)) return
    submit()
  } else {
    return
  }
  event.preventDefault()
})
</script>

<template>
  <div ref="root" class="answer">
    <div class="timebox-row">
      <template v-for="box in ['hour', 'minute'] as const" :key="box">
        <span v-if="box === 'minute'" class="colon" aria-hidden="true">:</span>
        <button
          type="button"
          class="timebox"
          :class="[box, { focus: entry.selected === box }]"
          :data-box="box"
          :aria-label="t(box === 'hour' ? 'round.hours' : 'round.minutes')"
          :aria-pressed="entry.selected === box"
          :aria-invalid="errors.includes(box) || undefined"
          @click="select(box)"
          @focus="select(box)"
        >
          {{ shown(box) }}
        </button>
      </template>
    </div>
    <p v-if="errors.length" class="error" role="alert">
      <span v-for="box in errors" :key="box">{{ t(`round.errors.${box}`) }}</span>
    </p>
    <NumberPad
      class="pad"
      @digit="(d) => edit(pressDigit(entry, d))"
      @clear="edit(clearBox(entry))"
    />
    <button class="btn submit" type="button" :disabled="!ready" @click="submit">
      {{ t('round.submit') }}
    </button>
  </div>
</template>

<style scoped>
.answer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  width: min(340px, 100%);
}
.timebox-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.colon {
  font:
    900 58px 'Nunito',
    sans-serif;
  color: var(--text);
}
.timebox {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 96px;
  padding: 0;
  border-radius: 22px;
  border: 4px solid transparent;
  background: var(--face);
  color: var(--num);
  font:
    900 58px 'Nunito',
    sans-serif;
  cursor: pointer;
}
.timebox.hour {
  width: 92px;
}
.timebox.minute {
  width: 150px;
}
.timebox.focus {
  border-color: var(--accent);
}
.timebox[aria-invalid='true'] {
  border-color: var(--bad);
}
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  margin: -6px 0 0;
  font-weight: 800;
  color: var(--text);
}
.error span::before {
  content: '';
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 8px;
  border-radius: 50%;
  background: var(--bad);
}
.pad,
.submit {
  width: 100%;
}
@media (max-width: 600px), (max-height: 500px) {
  .answer {
    gap: 14px;
    width: 100%;
  }
  .timebox {
    height: 76px;
    font-size: 46px;
  }
  .colon {
    font-size: 46px;
  }
  .timebox.hour {
    width: 76px;
  }
  .timebox.minute {
    width: 120px;
  }
}
</style>
