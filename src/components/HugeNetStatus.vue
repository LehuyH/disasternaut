<template>
    <section class="hud-element hugenet-status">
        <h1>
            <span class="huge">HugeNet</span>
            <span class="thin">AI</span>
        </h1>
        <p>Day {{ state.persistent.day }} Hour {{ state.persistent.hour }} {{timeIcon}} | Health {{state.persistent.health}}</p>
        <hr />

        <p class="status" :style="{ backgroundColor: status.color }">
            <transition name="fade" mode="out-in">
                <span
                    :key="status.text.split(' ')[0]"
                    :class="{ flicker: state.currentDiaster }"
                >{{ status.text }}</span>
            </transition>
        </p>

        <p class="objectives-title" v-if="objectives?.length">Survival Objectives</p>
        <section class="objectives-list">
            <transition-group name="slide-fade" tag="p" mode="out-in">
                <p v-for="(o) in objectives" :key="o.name">
                    <details open>
                        <summary>{{ o.name }}</summary>
                        <small>{{ o.description }}</small>
                    </details>
                </p>
            </transition-group>
        </section>
    </section>
</template>

<script setup lang="ts">
import { computed, reactive, watchEffect } from "vue"
import { state, wait, setQuota } from "@/state"
import { playDisasterAudio, playBgAudio } from "@/state/audio"
import k from "@/kaboom"
import { startDisaster } from "@/kaboom/logic/disaster"

const customStatus = reactive({
    enabled: false,
    text: "",
    color: "",
})

const timeIcon = computed(() =>{
    if(state.persistent.hour <= 5) return "🌕"
    if(state.persistent.hour <= 7 ) return "🌅"
    if(state.persistent.hour <= 16) return "☀️"
    if(state.persistent.hour <= 19) return "🌇"
    if(state.persistent.hour <= 20) return  "🌙"
    if(state.persistent.hour === 24) return "🌕"
})

const status = computed(() => {
    const inDebt = (state.persistent.failures >= 3)
    if (inDebt) return { text: "DISABLED", color: "#2d3436" }

    const hasShelter = (k.get("shelter").length > 0 || state.persistent.map.buildings.find(b => b.name === "shelter"))
    if (!hasShelter) return { text: "OFFLINE", color: "#2d3436" }

    const hasPower = (k.get("nuclear_generator").length > 0 || state.persistent.map.buildings.find(b => b.name === "nuclear_generator"))
    if (!hasPower) return { text: "NO POWER", color: "#d63031" }

    //Tutorial Trigger
    if (state.persistent.numDisasters === 0) {
        customStatus.color = "#636e72"
        customStatus.text = "Power Established"
        customStatus.enabled = true

        wait(3, () => {
            customStatus.text = "Checking Systems..."
        })

        wait(4, () => {
            customStatus.text = "Booting Up..."
        })

        wait(8, () => {
            customStatus.text = "HugeNET"
            customStatus.color = "var(--huge)"
        })
        wait(13, () => {
            customStatus.text = "The Most Advanced Survival AI"
            customStatus.color = "var(--huge)"
        })
        wait(15, () => {
            customStatus.text = "New Planet Detected..."
            customStatus.color = "#636e72"
        })
        wait(17, () => {
            customStatus.text = "Scanning Area..."
            customStatus.color = "#636e72"
        })
        wait(25, () => {
            customStatus.text = "DISASTER DETECTED"
            customStatus.color = "#d63031"
            startDisaster("meteor", 15)
        })
        wait(26, () => {
            customStatus.enabled = false
        })
    }

    if (customStatus.enabled) return customStatus;
    if(state.currentDiaster) return {text:`${state.currentDiaster.name?.toUpperCase()} ${new Date(state.disasterTimer * 1000).toISOString().substr(14, 5)}`,color:"#d63031"}

    return { text: "All Systems Operational", color: "#10ac84" }
})

const objectives = computed(() => {
    const hasComms = (k.get("communications").length > 0 || state.persistent.map.buildings.find(b => b.name === "communications"))
    
    if (status.value.text === "DISABLED") return [{
        name: "Pay Off Your Debts",
        description: "HugeNET is disabled until you pay your debts. A button in top right corner displays your debt."
    }]

    if (status.value.text === "OFFLINE") return [{
        name: "Establish A Shelter",
        description: "HUGE has given you a shelter building kit to get you started! You can place it by selecting it on the bottom of the screen."
    }]

    if (status.value.text === "NO POWER") return [{
        name: "Establish Power",
        description: "HugeNET is unable to function properly without power. Please build a nuclear generator to generate power."
    }]

    if (state.currentDiaster) return [
        {
            name: `Survive ${state.currentDiaster.name}`,
            description: state.currentDiaster.description
        }
    ]
    const statusObjectives = [] as any[]

    if (!hasComms) {
        statusObjectives.push({
            name: "Build a Communication Tower",
            description: "HugeNET has calculated that your chances of survival without HUGE support is 0%. You need to gather metal and build a communications tower soon."
        })
    }
    
    if (state.persistent.quota && hasComms){
        if(state.persistent.quotaDay === null) setQuota()
        statusObjectives.push({
            name: `Extract Resources To Meet Your Quota (Deadline: Day ${state.persistent.quotaDay})`,
            description: "In exchange for your planet, HUGE expects you to provide resources back to them. A button in top right corner displays your quota. You need to meet this quota to fufil your contract."
        })
    }

    if(state.persistent.hour >= 19 || state.persistent.hour <= 3){
         statusObjectives.push({
            name: `Rest`,
            description: "HugeNET has detected fatigue within your body. Go to the shelter bed and rest to allow for natural recovery."
        })
    }
    return statusObjectives
})

watchEffect(()=>{
    if(state.scene === "onboarding") return;
    if(state.currentDiaster) playDisasterAudio()
    else playBgAudio()
})
</script>

<style scoped>
.hugenet-status {
    position: fixed;
    top: 0;
    left: 0;
    width: 300px;
    padding: 10px;
}

.objectives-title {
    margin-top: 1rem;
}

.status {
    font-family: monospace;
    background-color: #d63031;
    transition: all 1s ease-in-out;
    padding: 1rem 0.5rem;
    text-align: center;
}

details {
    padding: 0.5rem;
    background-color: rgba(0, 0, 0, 0.5);
}

details summary {
    cursor: pointer;
}

details small {
    display: inline-block;
    margin-top: 8px;
}

.flicker {
    animation: flicker 1s linear infinite;
}

@keyframes flicker {
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
</style>