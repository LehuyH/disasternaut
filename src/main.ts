import { createApp } from 'vue'
import App from './App.vue'

//Audio
import { audio } from "@/state/audio"

//Kaboom
import k from "./kaboom"
import "@/kaboom/scenes/planet"
import "@/kaboom/scenes/shelter"
import "@/kaboom/scenes/death"
import "@/kaboom/scenes/onboarding"

//(window as any).k = k

//Check for localstorage Access
try{
    window.localStorage.length
}catch(e){
    alert("Hi, please open this page in a NEW tab or window. This game requires the use of localStorage to function. Unfortunately, embedded storage windows are not supported.")
}

//Handle inputs that remain on canvas unfocus 
k.canvas.addEventListener('blur', ()=>{
    const keys = ["w","a","s","d","ArrowRight","ArrowLeft","ArrowUp","ArrowDown"]
    keys.forEach(key=>{
        k.canvas.dispatchEvent(new KeyboardEvent('keyup',{key}))
    })
})

//Vue
const app = createApp(App)
app.mount('#app')
