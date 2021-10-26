<template>
    <transition name="fade">
        <div v-if="Object.values(state.persistent.quota).length > 0 && state.interaction.showQuota" class="quota-view overlay">
            <button class="close" @click="state.interaction.showQuota = false;">
                <span class="iconify" data-icon="ci:close-small"></span>
            </button>

            <div class="quota-content popup-view">
                <h1>Production {{(state.persistent.failures < 3) ? "Quotas" : "Debts"}} (Checked On: Day {{state.persistent.quotaDay}})</h1>
                <hr />

                <div class="material-progress" v-for="(amount, type, i) in state.persistent.quota" :key="i">
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
                <br>
                <p>Upon completion, you will receive <b>permanent</b> upgrades to your armor!</p>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { state, matImageMap } from "@/state";
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

.quota-view {
    z-index: 6;
    background: #003366e1;

    display: flex;
    justify-content: center;
    align-items: center;
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
