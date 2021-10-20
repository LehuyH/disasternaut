import { createApp } from 'vue'
import mitt from 'mitt'
import App from './App.vue'

//Kaboom
import k from "./kaboom"
import "@/kaboom/scenes/planet"

(window as any).k = k

//Vue
const events = mitt()
const app = createApp(App)

app.config.globalProperties.events = events

app.mount('#app')
