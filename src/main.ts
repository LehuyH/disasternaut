import { createApp } from 'vue'
import mitt from 'mitt'
import App from './App.vue'

const events = mitt()

const app = createApp(App)
app.config.globalProperties.events = events

app.mount('#app')
