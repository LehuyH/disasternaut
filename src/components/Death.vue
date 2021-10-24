<template>
    <transition name="fade">
        <section class="overlay" v-if="state.scene === 'death'">
            <h1>You have fallen!</h1>
            <p>
                It turns out that colonizing new planets may be harder than you thought. <br>
                HugeNET has kept you <i>barely</i> alive, and you recover the next day.
                <br>
                <br>
                <b>In order to keep you alive, HugeNET has automatically used up some of your resources</b>
            </p>
            <button @click="nextDay">Continue To Next Day</button>
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
    text-align: center;
}
</style>