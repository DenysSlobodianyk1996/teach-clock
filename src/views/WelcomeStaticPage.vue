<script setup lang="ts">
/**
 * The English Welcome the GitHub Pages build writes into index.html's #app (batch 31), rendered at
 * build time (src/welcomeStatic.ts), so a search engine that runs no JavaScript reads the game. It
 * is the app's own Welcome in the app's frame, header and Footer, so the app mounting over it in
 * the Player's language barely moves anything. The header keeps room for the language and theme
 * buttons, which need JavaScript.
 */
import AppFooter from '@/components/AppFooter.vue'
import AppFrame from '@/components/AppFrame.vue'
import HeaderBar from '@/components/HeaderBar.vue'
import WelcomeView from './WelcomeView.vue'
import { PRERENDERED } from '@/static/prerenderedWelcome'

const marker = { [PRERENDERED]: '' }
</script>

<template>
  <div v-bind="marker" lang="en">
    <AppFrame>
      <template #header>
        <HeaderBar>
          <span class="tool-room" aria-hidden="true" />
          <span class="tool-room" aria-hidden="true" />
        </HeaderBar>
      </template>
      <WelcomeView />
      <template #footer><AppFooter /></template>
    </AppFrame>
  </div>
</template>

<style scoped>
/* The size of a round header button (HeaderButton). */
.tool-room {
  width: 48px;
  height: 48px;
}
</style>
