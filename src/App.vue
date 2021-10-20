<script setup lang="ts">
import Vignette from "./components/Vignette.vue"
import Overlay from "./components/Overlay.vue"
import { getEvents, state, setScene, addTool, setTool } from "@/state"
import { PosComp } from "kaboom"
import { startDisaster } from "@/kaboom/logic/disaster"
import k from "@/kaboom"
import { onMounted, ref } from "vue"

onMounted(() => {
  k.ready(() => {
    k.focus()
    setScene("planet")

    //Add an Axe
    addTool({
      name:"Axe",
      spriteName:"axe",
      power:1,
      effective:["tree"]
    })
    setTool(0)

    setTimeout(()=>{
      startDisaster("meteor",10)
    },2000)
  })
})



//Build a building
function build(name: string) {
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
        update() {
          const building = this as any
          building.moveTo(k.mouseWorldPos());
          //Delete when not building
          if (!state.interaction.placingBuilding) (this as any).destroy()
        }
      },
      "preview"
    ]
  )
}

const overlayShowing = ref(true);
</script>

<template>
  <Vignette />
  <Overlay
    v-model="overlayShowing"
    title="Disaster Alert!"
    text="HugeNET has detected an incoming meteor shower!"
    color="red"
  />

  <header></header>

  <footer>
    <div class="button-group">
      <button v-if="!state.interaction.placingBuilding" @click="build('shelter')">Place Shelter</button>
      <button
        v-if="!state.interaction.placingBuilding"
        @click="build('nuclear_generator')"
      >Place Nuclear Generator</button>
      <button v-else @click="state.interaction.placingBuilding = null">Cancel</button>
    </div>

    <div style="color:white">
    <p v-for="([name,value]) in Object.entries(state.persistent.resources)">
      {{name}}:{{value}}
    </p>
  </div>
  </footer>
</template>

<style>
header,
footer {
  height: 75px;
  position: fixed;
  left: 0;
  right: 0;

  text-align: center;

  background: var(--black);

  display: flex;
  align-items: center;
  justify-content: center;
}

header {
  top: 0;
}

footer {
  bottom: 0;
}
</style>
