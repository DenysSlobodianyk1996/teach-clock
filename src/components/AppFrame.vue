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
}

/* The play area fills the window under the header, at every width. */
.stage {
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  width: 100%;
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

/* The screen's content stops at --content-max, centred with free space either side. <main> itself
   stays full width, so its scrollbar is at the window's edge. */
.screen > :deep(*) {
  width: 100%;
  max-width: var(--content-max);
  margin-left: auto;
  margin-right: auto;
}
</style>
