import './styles/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { createAppRouter } from './router'
import { createAppI18n } from './i18n'
import { registerServiceWorker } from './pwa'

const app = createApp(App)

app.use(createPinia())
const router = createAppRouter()
app.use(router)
app.use(createAppI18n())

app.mount('#app')

registerServiceWorker(router)
