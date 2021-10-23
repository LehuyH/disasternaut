<template>
<transition name="fade">
    <section v-if="state.scene === 'shelter'">
            <p class="status">
                <b>Shelter Oxygen Remaning</b>
                <p :class="{flicker:state.currentDiaster}">{{ state.persistent.oxygen }}</p>
            </p>
    </section>
</transition>
</template>

<script setup lang="ts">
import { state } from "@/state"
</script>

<style scoped>

section{
   transform: translate(-50%, 0%);
   left: 50%;
   top:0%;
   position: fixed;
}
.status {
    font-family: monospace;
    background-color: #2d3436;
    transition: all 1s ease-in-out;
    padding: 1rem 0.5rem;
    text-align: center;
}

</style>