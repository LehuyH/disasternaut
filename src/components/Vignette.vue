<template>
  <div class="overlay" :style="{
    'box-shadow': `0 0 300px rgba(0, 0, 0, ${darkness}) inset;`
  }"></div>
</template>

<script setup>
import { state } from "@/state"

const darkness = computed(()=>1 - (Math.abs(12 - state.persistent.hour)/12)
</script>

<style scoped>
div {
  box-shadow: 0 0 200px rgba(0, 0, 0, 0.9) inset;
  pointer-events: none;
  z-index:1;
  position: fixed;
  top:0px;
  height:100vh;
}
</style>