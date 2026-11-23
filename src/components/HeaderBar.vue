<script setup lang="ts">
/**
 * The header's look: the brand mark and the game's name, with room on the right for tools. The app
 * fills the tools in AppHeader; the static privacy/index.html shows the brand alone (it has no router).
 */
import { useI18n } from 'vue-i18n'
import BrandMark from './BrandMark.vue'

defineProps<{
  /** Next to Home or Leave on a phone, only the brand mark fits. */
  crowded?: boolean
}>()

const { t } = useI18n()
</script>

<template>
  <header class="hdr" :class="{ 'with-tools': $slots.default }">
    <div class="brand">
      <BrandMark class="brand-mark" />
      <span class="brand-name" :class="{ crowded }">{{ t('app.name') }}</span>
    </div>
    <div v-if="$slots.default" class="hdr-tools">
      <slot />
    </div>
  </header>
</template>

<style scoped>
.hdr {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  /* Under the status bar too, so the bar sits on the header's background; the controls below it. */
  box-sizing: content-box;
  height: var(--header-height);
  padding: var(--inset-top) 20px 0;
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

/* A wide window: the brand and tools line up with the screen's content column (AppFrame). */
@media (min-width: 1100px) {
  .hdr {
    padding-inline: max(40px, calc((100% - var(--content-max)) / 2 + 48px));
  }
}
/* Phones: room only for icons, as in the design. Names stay for screen readers. */
@media (--phone) {
  .hdr {
    gap: 8px;
    padding-inline: 14px;
  }
  .hdr-tools {
    gap: 6px;
  }
  .brand {
    font-size: 18px;
  }
  .brand-name {
    white-space: nowrap;
  }
  .brand-name.crowded {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }
}
/* Narrow phones: the Preferences alone leave room only for the brand mark. */
@media (max-width: 430px) {
  .with-tools .brand-name {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }
}
</style>
