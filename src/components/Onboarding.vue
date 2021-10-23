<template>
    <transition name="fade">
        <!-- <section class="onboarding overlay" v-if="state.stage === 'onboarding'"> -->
        <section class="onboarding overlay">
            <h1>H.U.G.E</h1>
            <small>(Humans United on Galactic Exploration)</small>
            <h2 class="thin">wants to outsource <b>you</b> a newly discovered planet!</h2>
        </section>
    </transition>
</template>

<script setup lang="ts">
</script>

<style scoped>
.onboarding {
    z-index: 10;
    background: rgb(27, 35, 59);
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

h1 {
    font-size: 100px;
}

small {
    margin-top: -20px;
    margin-bottom: 10px;
}
</style>