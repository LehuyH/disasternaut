<template>
<transition name="fade">
    <section v-if="isSleeping" class="sleeping">
    </section>
    <section v-else-if="state.interaction.nextToBed">
      <div class="sleep-prompt" v-if="state.persistent.hour >= 14">
          <h1>Go to Sleep?</h1>
          <button @click="sleep">Sleep (+6h)</button>
      </div>
      <div class="sleep-prompt" v-else>
          It is too early to sleep
      </div>
    </section>
    <section v-else-if="state.scene === 'shelter'">
            <p class="status">
                <b>Shelter Oxygen Remaning</b>
                <p :class="{flicker:state.currentDiaster}">{{ Math.max(state.persistent.oxygen,0) }}</p>
            </p>
    </section>
</transition>
</template>

<script setup lang="ts">
import { state } from "@/state"
import { ref } from "vue"

const isSleeping = ref(false)

function sleep(){
    if(isSleeping.value) return;

    isSleeping.value = true
    if(state.persistent.hour + 6 > 24){
        state.persistent.day++
        state.persistent.hour = (state.persistent.hour + 6) - 24
    }else{
        state.persistent.hour += 6
    }
    
    setTimeout(() =>{
        isSleeping.value = false
    },2000)
}
</script>

<style scoped>

section{
   transform: translate(-50%, 0%);
   left: 50%;
   top:0%;
   position: fixed;
}
.status {
    font-family: monospace;
    background-color: #2d3436;
    transition: all 1s ease-in-out;
    padding: 1rem 0.5rem;
    text-align: center;
}

.sleep-prompt {
    text-align: center;
    padding: 5vh 0vh;
    pointer-events: all;
}

.sleeping{
    position:fixed;
    height: 100vh;
    width: 100vw;
    top:0;
    background-color: rgba(0,0,0,1);
    pointer-events: none;
}

</style>