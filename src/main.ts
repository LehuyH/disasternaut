import { createApp } from 'vue'
import mitt from 'mitt'
import App from './App.vue'

//Audio
import { audio } from "@/state/audio"

//Kaboom
import k from "./kaboom"
import "@/kaboom/scenes/planet"
import "@/kaboom/scenes/shelter"
import "@/kaboom/scenes/death"

(window as any).k = k

//Handle inputs that remain on canvas unfocus 
k.canvas.addEventListener('blur', ()=>{
    k.canvas.dispatchEvent(new KeyboardEvent('keyup',{key:"w"}))
    k.canvas.dispatchEvent(new KeyboardEvent('keyup',{key:"a"}))
    k.canvas.dispatchEvent(new KeyboardEvent('keyup',{key:"s"}))
    k.canvas.dispatchEvent(new KeyboardEvent('keyup',{key:"d"}))
})

//Vue
const events = mitt()
const app = createApp(App)

app.config.globalProperties.events = events

app.mount('#app')
