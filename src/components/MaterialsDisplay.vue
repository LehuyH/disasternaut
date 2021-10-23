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
        <a @click="showQuotas">View Quotas</a>
    </div>
</template>

<script setup lang="ts">
import { state, matImageMap } from "@/state";

function showQuotas() {
    state.interaction.showQuota = true;
}
</script>

<style scoped>
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

p,
a {
    margin: 10px;
    display: flex;
    align-items: center;
}

a {
    color: #9bcdff;
    font-weight: bold;
    cursor: pointer;
}

a:hover {
    text-decoration: underline;
}

.materials-display img {
    margin: 0 5px;
}

.mat-name {
    text-transform: capitalize;
}
</style>