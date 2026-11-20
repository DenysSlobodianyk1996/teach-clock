<script setup lang="ts">
/**
 * The page around every screen: the header on top, then the play area with the screen in it and an
 * optional Footer below. The app (App.vue) and the static privacy/index.html share it, so they look alike.
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
/* The page is the screen's height and never scrolls (batch 25): the header stays on top, the Footer
   at the bottom, and only <main> between them scrolls, when a screen cannot fit. The background runs
   under the system bars; the content stays between them. The header takes the top inset itself
   (HeaderBar), so its background runs under the status bar. */
.app {
  display: flex;
  flex-direction: column;
  /* vh first: old Android WebViews lack dvh. */
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  padding: 0 var(--inset-right) var(--inset-bottom) var(--inset-left);
}

.stage-wrap {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

/* The play area keeps 4:3, fits the screen under the header and stops at ~1024 px. */
.stage {
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  width: min(100%, var(--stage-max), calc((var(--safe-height) - var(--header-height)) * 4 / 3));
  max-height: 100%;
  aspect-ratio: 4 / 3;
  background: var(--bg);
}

/* The screen fills the stage above the Footer and scrolls on its own; each view grows inside it.
   A size container, so a screen can size its clock from the height <main> has (100cqh). */
.screen {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  container-type: size;
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
    width: min(
      100%,
      var(--stage-max),
      calc((var(--safe-height) - var(--header-height) - 40px) * 4 / 3)
    );
    border-radius: 32px;
    box-shadow: var(--shadow);
    overflow: hidden;
  }
}

/* Phones (upright or sideways): no 4:3, the stage takes all the height under the header. */
@media (--phone) {
  .stage-wrap {
    align-items: stretch;
  }
  .stage {
    width: 100%;
    aspect-ratio: auto;
  }
}
</style>
