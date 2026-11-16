<script setup lang="ts">
/**
 * The page around every screen: the header on top, then the play area with the screen in it and an
 * optional Footer below. The app (App.vue) and the static privacy.html share it, so they look alike.
 */
</script>

<template>
  <div class="app">
    <slot name="header" />
    <div class="stage-wrap">
      <div class="stage">
        <main class="screen">
          <slot />
        </main>
        <!-- Outside <main>, so it is the page's contentinfo landmark. -->
        <slot name="footer" />
      </div>
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

/* The screen fills the stage above the Footer; each view grows inside it. */
.screen {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

/* Desktop: the stage sits as a card on a deeper background. Not when taller than wide: that is the
   phone layout (see src/styles/media.ts). */
@media (min-width: 1100px) and (min-height: 860px) and (orientation: landscape) {
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
@media (--phone) {
  .stage {
    width: 100%;
    aspect-ratio: auto;
    min-height: calc(100dvh - var(--header-height));
  }
}
</style>
