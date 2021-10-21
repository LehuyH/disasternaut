<script setup lang="ts">
import Vignette from "./components/Vignette.vue"
import Overlay from "./components/Overlay.vue"
import { getEvents, state, setScene, addTool, setTool } from "@/state"
import { PosComp, SpriteComp, Vec2 } from "kaboom"
import { exportMapState } from "@/kaboom/logic/map"
import { startDisaster } from "@/kaboom/logic/disaster"
import k from "@/kaboom"
import { onMounted, ref } from "vue"

onMounted(() => {
  k.ready(() => {
    k.focus()
    setScene("planet")

    //Add an Axe
    addTool({
      name: "Axe",
      spriteName: "axe",
      power: 1,
      effective: ["tree"]
    })
    setTool(0)

    setTimeout(() => {
     // startDisaster("meteor", 10)
     const map = exportMapState()
     console.log(map)
    }, 2000)
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
      {
        update() {
          const building = this as PosComp;
          building.moveTo(state.position as Vec2);
          //Delete when not building
          if (!state.interaction.placingBuilding) (this as any).destroy()
        }
      },
      "preview"
    ]
  )
}

const overlayShowing = ref(false);

const matImageMap: Record<string, string> = {
  wood: "tree_1",
  metal: "metal_1",
  stone: "rock_1"
}
</script>

<template>
  <Vignette />
  <Overlay
    v-model="overlayShowing"
    title="Disaster Alert!"
    text="HugeNET has detected an incoming meteor shower!"
    color="red"
  />

  <header>
    <div class="materials-display">
      <p v-for="([name, value]) in Object.entries(state.persistent.resources)">
        <b class="mat-name">{{ name }}:&nbsp;</b>
        {{ value }}
        <img
          :src="`/sprites/${matImageMap[name]}.png`"
          :alt="`${name} material icon`"
        />
      </p>
    </div>
  </header>

  <ul class="notification-panel">
    <li v-for="(noti, i) in state.notis" :key="`${noti}-${i}`">{{ noti }}</li>
  </ul>

  <footer>
    <div class="button-group">
      <button v-if="!state.interaction.placingBuilding" @click="build('shelter')">Place Shelter</button>
      <button
        v-if="!state.interaction.placingBuilding"
        @click="build('nuclear_generator')"
      >Place Nuclear Generator</button>
      <button v-else @click="state.interaction.placingBuilding = null">Cancel</button>
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

  background: transparent;
  transition: background 0.15s ease-in-out;

  display: flex;
  align-items: center;
  justify-content: center;
}

header:hover,footer:hover{
   background: rgba(0, 0, 0,0.8);
}

header {
  top: 0;
}

footer {
  bottom: 0;
}

.materials-display {
  display: flex;
  margin-left: auto;
}

.materials-display img {
  height: 30px;
}

.materials-display p {
  margin: 10px;
  display: flex;
  align-items: center;
}

.materials-display img {
  margin: 0 5px;
}

.mat-name {
  text-transform: capitalize;
}

.notification-panel {
  z-index: 3;
  position: fixed;
  bottom: 75px;
  pointer-events: none;
  padding: 5px 7.5px;
  background: rgba(0, 0, 0, 0.199);
}
</style>
