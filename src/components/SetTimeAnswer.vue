<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { useEventListener } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import NumberPad from './NumberPad.vue'
import type { ClockTime } from '@/game/clockTime'
import {
  BOX_RANGE,
  canSubmit,
  clearBox,
  EMPTY_ENTRY,
  entryFor,
  pressDigit,
  readEntry,
  selectBox,
  type Box,
  type TimeEntry,
} from '@/game/timeEntry'

/**
 * Hour and minute boxes, the number pad and Submit. Mount a fresh one per Task (`:key`).
 * Emits only a possible Clock Time; an impossible one shows an error and waits for a fix.
 * `disabled` ignores every key and button; `fill(time)` puts a Clock Time in the boxes.
 */
const props = defineProps<{ disabled?: boolean }>()
const emit = defineEmits<{ submit: [time: ClockTime] }>()

const { t } = useI18n()

const root = ref<HTMLElement>()
const id = useId()
const rangeId = (box: Box) => `${id}-${box}-range`
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

/** Fills the boxes with a Clock Time ("Set correct answer"); the Player still submits. */
function fill(time: ClockTime) {
  edit(entryFor(time))
}

defineExpose({ fill })

function submit() {
  if (!ready.value || props.disabled) return
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
    // A held Enter would close the wrong-Answer popup and resubmit the same Answer over and over.
    if (event.repeat) return
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
    <div class="entry" :class="{ 'has-error': errors.length }">
      <template v-for="box in ['hour', 'minute'] as const" :key="box">
        <span v-if="box === 'minute'" class="colon" aria-hidden="true">:</span>
        <button
          type="button"
          class="timebox"
          :class="[box, { focus: entry.selected === box }]"
          :data-box="box"
          :aria-label="t(box === 'hour' ? 'round.hours' : 'round.minutes')"
          :aria-describedby="rangeId(box)"
          :aria-pressed="entry.selected === box"
          :aria-invalid="errors.includes(box) || undefined"
          @click="select(box)"
          @focus="select(box)"
        >
          {{ shown(box) }}
        </button>
        <span :id="rangeId(box)" class="range" :class="box">
          {{ t('round.range', BOX_RANGE[box]) }}
        </span>
      </template>
      <!-- Always in the page; on a wide screen it covers the ranges and the room under them, so
           nothing moves when an error appears. -->
      <p class="error" role="alert">
        <span v-for="box in errors" :key="box">{{ t(`round.errors.${box}`) }}</span>
      </p>
    </div>
    <NumberPad
      class="pad"
      :disabled="disabled"
      @digit="(d) => edit(pressDigit(entry, d))"
      @clear="edit(clearBox(entry))"
    />
    <button class="btn submit" type="button" :disabled="!ready || disabled" @click="submit">
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
/* Boxes on top, each box's range under it; the error lies over the ranges (see .error). */
.entry {
  display: grid;
  grid-template-columns: repeat(3, auto);
  grid-template-rows: auto 1.4em;
  justify-content: center;
  justify-items: center;
  align-items: center;
  gap: 4px 10px;
  /* With the answer's gap, room for an error's second line below the ranges. */
  margin-bottom: 8px;
}
.timebox.hour,
.range.hour {
  grid-column: 1;
}
.timebox.minute,
.range.minute {
  grid-column: 3;
}
.range {
  grid-row: 2;
  line-height: 1.4;
  font-weight: 800;
  color: var(--muted);
}
.has-error .range {
  visibility: hidden;
}
.colon {
  grid-column: 2;
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
  grid-column: 1 / -1;
  grid-row: 2;
  align-self: start;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  margin: 0;
  line-height: 1.4;
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
    gap: 10px;
    width: 100%;
  }
  .entry {
    grid-template-rows: auto auto auto;
    row-gap: 2px;
    /* Brings the pad up to 4px under the ranges. */
    margin-bottom: -6px;
  }
  .range {
    font-size: 14px;
  }
  /* On a phone the answer sits under the clock, so the error takes its own row under the ranges:
     a growing error moves nothing above it. */
  .error {
    grid-row: 3;
  }
  .has-error .range {
    visibility: visible;
  }
  .error:empty {
    display: none;
  }
  .timebox {
    height: 60px;
    font-size: 38px;
  }
  .colon {
    font-size: 38px;
  }
  .submit {
    min-height: 52px;
  }
  .timebox.hour {
    width: 76px;
  }
  .timebox.minute {
    width: 120px;
  }
}
</style>
