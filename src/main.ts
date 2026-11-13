import './styles/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { createAppRouter } from './router'
import { createAppI18n } from './i18n'
import { registerServiceWorker } from './pwa'
import { isAndroidApp } from './platform'

const app = createApp(App)

app.use(createPinia())
const router = createAppRouter()
app.use(router)
app.use(createAppI18n())

app.mount('#app')

// The Android App packages the game inside it, so it has no service worker (ADR 0004).
// Its hardware back button acts per screen and never drops a Player out of a Round.
if (isAndroidApp) {
  void import('./android/backButton').then(({ listenToBackButton }) => listenToBackButton(router))
} else {
  registerServiceWorker(router)
}
