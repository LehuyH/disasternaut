import { createApp, reactive } from 'vue'
import mitt from 'mitt'
import App from './App.vue'

const events = mitt()

const app = createApp(App)
app.config.globalProperties.events = events
app.config.globalProperties.state = reactive({})

app.mount('#app')
