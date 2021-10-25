<template>
    <div class="hud-element materials-display">
        <transition-group name="fade">
            <p v-for="([name, value]) in Object.entries(state.persistent.resources)">
                <b class="mat-name">{{ name }}:&nbsp;</b>
                {{ value }}
                <img
                    :src="`/sprites/${matImageMap[name]}.png`"
                    :alt="`${name} material icon`"
                />
            </p>
        </transition-group>
        <transition name="zoom">
            <a
                @click="showQuotas"
                v-if="Object.values(state.persistent.quota).length > 0"
            >View {{ (state.persistent.failures < 3) ? "Quotas" : "Debts" }}</a>
        </transition>
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
    flex-direction: column;
    z-index: 3;
    background: rgba(0, 0, 0, 0.199);
    border-bottom-left-radius: 15px;
    width: 151px;
}

.materials-display img {
    height: 30px;
}

p,
a {
    margin: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
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

.zoom-enter-from {
    opacity: 0;
    transform: scale(5) translateY(20vh) translateX(-20vw);
}

.zoom-enter-active {
    transition: 5s transform ease-in-out;
}

.zoom-enter-to {
    transform: scale(1) translateY(0) translateX(0);
}
</style>