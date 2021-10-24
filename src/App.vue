<script setup lang="ts">
import Vignette from "./components/Vignette.vue"
import HugeNetStatus from "./components/HugeNetStatus.vue"
import ShelterStatus from "./components/ShelterStatus.vue"
import MaterialsDisplay from "./components/MaterialsDisplay.vue"
import HugeNetHotBar from "./components/HugeNetHotBar.vue"
import NotificationPanel from "./components/NotificationPanel.vue"
import QuotaView from "./components/QuotaView.vue"
import Death from "./components/Death.vue"
import Onboarding from "./components/Onboarding.vue"
import Report from "./components/Report.vue"
</script>

<template>
  <Report/>
  <Onboarding />
  <QuotaView />
  <Death />
  <Vignette />
  <MaterialsDisplay />
  <HugeNetStatus />
  <ShelterStatus />
  <HugeNetHotBar />
  <NotificationPanel />
</template>


