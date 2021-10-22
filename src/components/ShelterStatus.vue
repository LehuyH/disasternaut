<template>
<transition name="fade">
    <section v-if="state.scene === 'shelter'">
            <p class="status">
                <b>Shelter Oxygen Remaning</b>
                <p :class="{flicker:state.currentDiaster}">{{state.persistent.oxygen}}</p>
            </p>
    </section>
</transition>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import { state } from "@/state"

    const stateComputed = computed(()=>state)
</script>

<style scoped>
.objectives-title {
    margin-top: 1rem;
}

.thin {
    font-weight: 100;
}

.status {
    font-family: monospace;
    background-color: #2d3436;
    transition: all 1s ease-in-out;
    padding: 1rem 0.5rem;
    text-align: center;
}
details{
    padding: 0.5rem;
    background-color:rgba(0,0,0,0.5)
}

.flicker{
    animation: flicker 1s linear infinite;
}

@keyframes flicker {
  0%   { opacity:1; }
  50%  { opacity:0; }
  100% { opacity:1; }
}
</style>