<template>

    <canvas ref="canvas"></canvas>

</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import instance, { createInstance } from "../kaboom/boot";
import { getEvents } from "@state/index"

const events = getEvents()
const canvas = ref(null)


onMounted(()=>{
    createInstance((canvas.value as any as HTMLCanvasElement))
    const k = instance.k

    k.ready(()=>{
        events.emit("loaded")
    })

    k.go("planet")
    

})

</script>


<style scoped>
canvas{
    position: fixed;
    top:0;
    left:0;
    width:100vw;
    height:100vh;

}
</style>