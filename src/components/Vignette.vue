<template>
  <div class="hud-element" :style="`box-shadow:0 0 2000px ${color} inset;`"></div>
</template>

<script setup lang="ts">
import { state } from "@/state"
import { computed, watch, ref } from "vue"

const isRed = ref(false)
const darkness = computed(() => (Math.abs(12 - state.persistent.hour)/12))
const color = computed(() =>{
  return (isRed.value) ? `rgba(138,3,3,${darkness.value + 1})` : `rgba(0,0,0,${darkness.value})`
})


//Red effect
watch(() => state.persistent.health,(health:number,prevHealth:number)=>{
  if(health < prevHealth){
    isRed.value = true

    setTimeout(()=>{
      isRed.value = false
    },500)
  }
})
</script>

<style scoped>
div {
  box-shadow: 0 0 200px rgba(116, 83, 83, 0) inset;
  z-index: 1;
  position: fixed;
  top: 0px;
  left:0px;
  height: 100vh;
  width: 100vw;
  transition: box-shadow 0.25ms ease-in-out;
}
</style>