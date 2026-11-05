import './styles/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { createAppRouter } from './router'
import { createAppI18n } from './i18n'

const app = createApp(App)

app.use(createPinia())
app.use(createAppRouter())
app.use(createAppI18n())

app.mount('#app')
