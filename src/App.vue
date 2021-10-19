<script setup lang="ts">
  import Vignette from "./components/Vignette.vue"
  import { getEvents,state,setScene } from "@/state"
  import { PosComp } from "kaboom"
  import { startDisaster } from "@/kaboom/logic/disaster"
  import k from "@/kaboom"

  
  k.ready(()=>{
  
    k.focus()
    setScene("planet")
    setTimeout(()=>{
      startDisaster("meteor",10)
    },1000)
  })

  
  
  //Build a building
  function build(name:string){
    state.interaction.placingBuilding = name
    //Preview
    k.add(
      [
        k.sprite(name),
        k.pos(),
        k.origin("center"),
        k.opacity(0.5),
        k.area(),
        k.solid(),
        {
          update(){
            const building = this as any
            building.moveTo(k.mouseWorldPos());
            //Delete when not building
            if(!state.interaction.placingBuilding) (this as any).destroy()
          }
        },
        "preview"
      ] 
    )
  }

</script>

<template>
  <Vignette></Vignette>
  <button v-if="!state.interaction.placingBuilding" @click="build('shelter')">Place Shelter</button>
  <button v-if="!state.interaction.placingBuilding" @click="build('nuclear_generator')">Place Nuclear Generator</button>
  <button v-else @click="state.interaction.placingBuilding = null">Cancel</button>
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
  position: relative;
  z-index: 2;
}
</style>
