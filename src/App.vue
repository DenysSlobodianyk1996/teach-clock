<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <div class="app">
    <AppHeader />
    <div class="stage-wrap">
      <main class="stage">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}

.stage-wrap {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

/* The play area keeps 4:3, fits the screen under the header and stops at ~1024 px. */
.stage {
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  width: min(100%, var(--stage-max), calc((100dvh - var(--header-height)) * 4 / 3));
  aspect-ratio: 4 / 3;
  background: var(--bg);
}

/* Desktop: the stage sits as a card on a deeper background. */
@media (min-width: 1100px) and (min-height: 860px) {
  .app {
    background: var(--bg-deep);
  }
  .stage-wrap {
    padding-top: 20px;
  }
  .stage {
    width: min(100%, var(--stage-max), calc((100dvh - var(--header-height) - 40px) * 4 / 3));
    border-radius: 32px;
    box-shadow: var(--shadow);
  }
}

/* Phones (upright or sideways): no 4:3, the screen stacks and scrolls. */
@media (max-width: 600px), (max-height: 500px) {
  .stage {
    width: 100%;
    aspect-ratio: auto;
    min-height: calc(100dvh - var(--header-height));
  }
}
</style>
