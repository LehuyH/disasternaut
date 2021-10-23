<script setup lang="ts">
import Vignette from "./components/Vignette.vue"
import HugeNetStatus from "./components/HugeNetStatus.vue"
import ShelterStatus from "./components/ShelterStatus.vue"

import { getEvents, state, setScene, addTool, setTool } from "@/state"
import { PosComp, SpriteComp, Vec2 } from "kaboom"
import { exportMapState } from "@/kaboom/logic/map"
import k from "@/kaboom"
import { onMounted, ref } from "vue"
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
</script>

<template>
    <Vignette />
    <MaterialsDisplay />
    <HugeNetStatus />
    <ShelterStatus />
    <HugeNetHotBar />
    <NotificationPanel />
</template>
