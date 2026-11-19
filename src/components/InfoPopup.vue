<script setup lang="ts">
import { useId } from 'vue'
import { useI18n } from 'vue-i18n'
import PopupDialog from './PopupDialog.vue'

/** One line of an Info Popup: an option by its name, with what it does. */
export interface InfoItem {
  name: string
  description: string
}

/**
 * Info Popup: the text an ⓘ stands for on a phone, under a heading: one paragraph (`text`) or a
 * list of options by name and description (`items`). One Got it button; Got it, Escape and the
 * scrim emit `dismiss`. Reading it changes nothing.
 */
defineProps<{ heading: string; text?: string; items?: readonly InfoItem[] }>()
const emit = defineEmits<{ dismiss: [] }>()

const { t } = useI18n()
const id = useId()
</script>

<template>
  <PopupDialog :labelledby="`${id}-title`" @dismiss="emit('dismiss')">
    <h2 :id="`${id}-title`">{{ heading }}</h2>
    <p v-if="text" class="text">{{ text }}</p>
    <dl v-if="items?.length" class="items">
      <div v-for="item in items" :key="item.name" class="item">
        <dt>{{ item.name }}</dt>
        <dd>{{ item.description }}</dd>
      </div>
    </dl>
    <button class="btn got-it" type="button" @click="emit('dismiss')">
      {{ t('teach.gotIt') }}
    </button>
  </PopupDialog>
</template>

<style scoped>
.text {
  line-height: 1.45;
  text-align: left;
}
.items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  margin: 0;
  text-align: left;
}
dt {
  font-size: 18px;
  font-weight: 900;
}
dd {
  margin: 2px 0 0;
  font-size: 16px;
  line-height: 1.4;
}
.got-it {
  width: min(300px, 100%);
}
</style>
