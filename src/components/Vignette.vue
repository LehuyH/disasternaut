<template>
  <div class="overlay" :style="`box-shadow:0 0 2000px rgba(0, 0, 0, ${darkness}) inset;`"></div>
</template>

<script setup lang="ts">
import { state } from "@/state"
import { computed } from "vue"
 
const darkness = computed(()=>(Math.abs(12 - state.persistent.hour)/12))
</script>

<style scoped>
div {
  box-shadow: 0 0 200px rgba(116, 83, 83, 0) inset;
  pointer-events: none;
  z-index:1;
  position: fixed;
  top:0px;
  height:100vh;
}
</style>