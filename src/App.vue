<script setup lang="ts">
import { state } from "@/state";

import Vignette from "./components/Vignette.vue"
import HugeNetStatus from "./components/HugeNetStatus.vue"
import ShelterStatus from "./components/ShelterStatus.vue"
import MaterialsDisplay from "./components/MaterialsDisplay.vue"
import HugeNetHotBar from "./components/HugeNetHotBar.vue"
import NotificationPanel from "./components/NotificationPanel.vue"
import QuotaView from "./components/QuotaView.vue"
import Death from "./components/Death.vue"
</script>

<template>
<QuotaView />
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


