<template>
    <ul class="notification-panel hud-element">
        <li v-for="(noti, i) in state.notis" :key="`${noti}-${i}`">{{ noti }}</li>
    </ul>
</template>

<script setup lang="ts">
import { state } from "@/state";
</script>

<style>
.notification-panel {
    z-index: 3;
    position: fixed;
    left: 0;
    bottom: 0;
    padding: 5px 7.5px;
    background: rgba(0, 0, 0, 0.199);
}
</style>