<script setup lang="ts">
import Vignette from "./components/Vignette.vue"
import HugeNetStatus from "./components/HugeNetStatus.vue"
import ShelterStatus from "./components/ShelterStatus.vue"
import Death from "./components/Death.vue"
import { setScene, addTool, setTool, state } from "@/state"
import k from "@/kaboom"
import { onMounted, computed } from "vue"
import MaterialsDisplay from "./components/MaterialsDisplay.vue"
import HugeNetHotBar from "./components/HugeNetHotBar.vue"
import NotificationPanel from "./components/NotificationPanel.vue"

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

    })
})

const stateComputed = computed(()=>state)
</script>

<template>
<transition name="fade">
<section v-if="state.scene === 'death'">
  <Death />
</section>
<section v-else>
  <Vignette />
  <MaterialsDisplay />
  <HugeNetStatus />
  <ShelterStatus />
  <HugeNetHotBar />
  <NotificationPanel />
</section>
</transition>
</template>
