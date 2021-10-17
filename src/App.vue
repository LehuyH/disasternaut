<script setup lang="ts">
  import KaboomGameVue from './components/KaboomGame.vue';
  import { getEvents } from "@state/index"

  const events = getEvents()
  
  events.on("loaded",()=>{
    console.log("KaboomGame loaded")
  })
</script>

<template>
  <KaboomGameVue></KaboomGameVue>
</template>

<style>
body{
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
