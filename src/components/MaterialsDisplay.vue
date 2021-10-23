<template>
    <div class="hud-element materials-display">
        <p v-for="([name, value]) in Object.entries(state.persistent.resources)">
            <b class="mat-name">{{ name }}:&nbsp;</b>
            {{ value }}
            <img
                :src="`/sprites/${matImageMap[name]}.png`"
                :alt="`${name} material icon`"
            />
        </p>
    </div>
</template>

<script setup lang="ts">
import { state } from "@/state";

const matImageMap: Record<string, string> = {
    wood: "tree_1",
    metal: "metal_1",
    stone: "rock_1",
    uranium: "uranium_1",
}
</script>

<style>
.materials-display {
    position: fixed;
    top: 0;
    right: 0;
    display: flex;
    z-index: 3;
    background: rgba(0, 0, 0, 0.199);
    border-bottom-left-radius: 20px;
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
</style>