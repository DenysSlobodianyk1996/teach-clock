import './styles/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { createAppRouter } from './router'
import { createAppI18n } from './i18n'

const app = createApp(App)

app.use(createPinia())
const router = createAppRouter()
app.use(router)
app.use(createAppI18n())

app.mount('#app')

// The Android App packages the game inside it, so it has no service worker (ADR 0004).
// Its hardware back button acts per screen and never drops a Player out of a Round.
// The one build-target test outside src/platform.ts: the bundler drops the branch it can prove dead
// only when the test is written out here, so the Android bundle gets no src/pwa.ts chunk at all.
if (import.meta.env.VITE_TARGET === 'android') {
  void import('./android/backButton').then(({ listenToBackButton }) => listenToBackButton(router))
} else {
  void import('./pwa').then(({ registerServiceWorker }) => registerServiceWorker(router))
}
