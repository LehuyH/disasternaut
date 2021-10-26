<template>
    <transition name="fade">
        <div v-if="state.interaction.showLog" class="overlay huge-log-container">
            <button class="close" @click="state.interaction.showLog = false;">
                <span class="iconify" data-icon="ci:close-small"></span>
            </button>
            <div class="huge-log popup-view">
                <h1>
                    HUGELog
                    <sup>TM</sup>
                </h1>
                <hr />

                <div
                    class="entry"
                    v-for="(entry, index) in state.persistent.log"
                    :key="`${entry.time.day}/${entry.time.hour}/${index}`"
                >
                    <h2>{{ entry.title }}</h2>
                    <q>{{ entry.description }}</q>
                    <br />
                    <br />
                    <i>
                        — HUGE Incorporated @
                        <b>Day {{ entry.time.day }}, Hour {{ entry.time.hour }},</b>
                    </i>
                </div>

                <div
                    class="entry"
                >
                    <h2>BREAKING NEWS: HUGENet detected disasters!</h2>
                    <q>
                        We are unsure as to the effects of these 'disasters' right now,
                        but it's up to you to defend and protect the colony.
                        HugeNET will keep analyzing for the meantime.
                    </q>
                    <br />
                    <br />
                    <i>
                        — HUGE Incorporated @
                        <b>Day 1, Hour 2</b>
                    </i>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { state } from "@/state";
</script>

<style scoped>
h1 {
    color: #003366;
}

.huge-log-container {
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 14;
    background: #003366e1;
}

.huge-log {
    max-width: 1280px;
    max-height: 80vh;
    overflow-y: auto;
}

hr {
    border: none;
    background-color: #003366;
    height: 3px;
    border-radius: 20px;
    margin: 10px 0;
}

.entry {
    padding: 10px 15px;
    border-radius: 10px;
    background: #0051a1;
    margin: 10px 0;
}

.entry.flipped {
    background: white;
}

.entry.flipped * {
    color: #003366;
}
</style>