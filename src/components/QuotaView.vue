<template>
    <transition name="fade">
        <div v-if="state.interaction.showQuota" class="quota-view overlay">
            <button class="close" @click="state.interaction.showQuota = false;">
                <span class="iconify" data-icon="ci:close-small"></span>
            </button>

            <div class="quota-content">
                <h1>Production Quota</h1>
                <hr />

                <div class="material-progress" v-for="(amount, type, i) in mockQuotas" :key="i">
                    <div class="type-indicator">
                        <b>{{ type }} ({{ state.persistent.resources[type] || 0 }}/{{ amount }}):</b>
                        <img
                            :src="`/sprites/${matImageMap[type]}.png`"
                            :alt="`${type} material icon`"
                        />
                    </div>
                    <div class="bar">
                        <div
                            class="filler"
                            :style="`width: ${(state.persistent.resources[type] || 0) * 100 / amount > 100 ? 100 : (state.persistent.resources[type] || 0) * 100 / amount}%`"
                        ></div>
                    </div>
                    <b></b>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import createQuota from "@/kaboom/logic/quota";
import { state, matImageMap } from "@/state";

const mockQuotas = createQuota();
</script>

<style scoped>
.material-progress {
    display: flex;
    margin: 25px 0;
    align-items: center;
}

.material-progress b {
    text-transform: capitalize;
}

.material-progress img {
    height: 30px;
    margin-right: 10px;
    margin-left: auto;
}

.material-progress .bar {
    flex: 1;
    height: 25px;
    background: rgb(127, 134, 145);
    border-radius: 20px;
    margin-left: 10px;
    overflow: hidden;
}

.material-progress .filler {
    background: #003366;
    border-radius: 20px;
    height: 100%;
    animation: fill-bar 0.5s ease-in-out;
}

.material-progress .type-indicator {
    display: flex;
    align-items: center;
    width: 170px;
}

@keyframes fill-bar {
    0% {
        width: 0;
    }
}

button.close {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 7;
    width: 60px;
    height: 60px;
    padding: 0;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform 0.25s ease;
    --accent: var(--red);
}

button.close:hover {
    transform: rotateZ(90deg);
}

button.close .iconify {
    font-size: 40px;
    position: relative;
}

.quota-view {
    z-index: 6;
    background: #003366e1;

    display: flex;
    justify-content: center;
    align-items: center;
}

.quota-content {
    background: white;
    padding: 20px 25px;
    border-radius: 20px;
    width: 75vw;
    /* height: 75vh; */
}

.quota-content * {
    color: #003366;
}

hr {
    border: none;
    background-color: #003366;
    height: 3px;
    border-radius: 20px;
    margin: 10px 0;
}
</style>
