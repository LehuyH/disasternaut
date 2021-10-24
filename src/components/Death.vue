<template>
    <transition name="fade">
        <section class="overlay" v-if="state.scene === 'death'">
            <h1>You have fallen!</h1>
            <p>
                HugeNET has went into critical mode and has kept you alive.
                <br />You recover the next day but the damage has been done...
            </p>
            <button @click="nextDay">Next Day</button>
        </section>
    </transition>
</template>

<script setup lang="ts">
import { state, setScene } from "@/state"
import k from "@/kaboom"

function nextDay() {
    state.persistent.day++

    //Unhide the player
    const player = k.get("player")[0]
    player.use(k.opacity(1))
    player.tool.use(k.opacity(1))
    player.allowMovement = true

    //Reset stats
    state.persistent.health = state.persistent.maxHealth
    state.persistent.oxygen = state.persistent.maxOxygen
    state.currentDiaster = null
    state.disasterTimer = 0

    //remove all resources
    Object.keys(state.persistent.resources).forEach(k => {
        state.persistent.resources[k] = Math.floor(state.persistent.resources[k]/2)
    })

    //Respawn player
    setScene("shelter")

}


</script>

<style scoped>
section {
    color: white;
    z-index: 10;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-evenly;
    background-color: rgba(138, 3, 3, 0.815);
}
</style>