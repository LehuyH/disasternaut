<template>
    <div class="hotbar hud-element">
        <transition name="fade" tag="div">
            <div class="placing-overlay" v-if="state.interaction.placingBuilding !== null">
                <h3 class="thin">
                    <b>{{ priceDisplay.name }}</b>
                    costs
                    {{ priceDisplay.costs.length === 0 ? "nothing" : "" }}
                    <template
                        v-for="([type, cost], i) in priceDisplay.costs"
                        :key="cost"
                    >
                        <img
                            :src="`/sprites/${matImageMap[type]}.png`"
                            :alt="`${type} material icon`"
                        />
                        {{ cost }} {{ type }}
                        {{ i !== priceDisplay.costs.length - 1 ? "+" : "" }}
                    </template>
                </h3>
                <hr />
                <h4 class="thin">Hit Escape to stop placing</h4>
            </div>
        </transition>

        <button
            v-for="(cost, name, i) in costs"
            :key="i"
            @click="build(name)"
            style="--accent: #003366; --border: white; --shadow: #003366ad; --distance: 100px;"
            :title="buttonMap[name].friendly"
            :class="{ pulsing: state.interaction.tutorialButtonPulsing[name] }"
        >
            <span class="iconify" :data-icon="buttonMap[name].icon"></span>

            <div class="name-tooltip-container hud-element">
                <b>{{ buttonMap[name].friendly }}</b>
                <br>
                <small>{{ buttonMap[name].description }}</small>
            </div>
        </button>
    </div>
</template>

<script setup lang="ts">
import { state, matImageMap } from "@/state";
import { costs } from "@/kaboom/logic/buildings";
import k from "@/kaboom";
import { PosComp, Vec2 } from "kaboom";
import { reactive } from "vue";

const buttonMap = {
    "nuclear_generator": {
        icon: "ion:nuclear-sharp",
        friendly: "Nuclear Generator",
        description: "A highly efficient generator that provides power to core services, such as HugeNET.",
    },
    "shelter": {
        icon: "ic:baseline-night-shelter",
        friendly: "Base Shelter",
        description: "A virtually indestructible shelter you recived from HUGE"
    },
    "communications": {
        icon: "maki:communications-tower",
        friendly: "Communications Tower",
        description: "Connects your colony to the rest of HUGE, lets you export farmed resources."
    },
    "oxygen_tank": {
        icon: "healthicons:oxygen-tank",
        friendly: "Oxygen Tank",
        description: "Increases the amount of oxygen your shelter can store (not immediate)."
    }
} as Record<string, {
    icon: string;
    friendly: string;
    description: string;
}>

const priceDisplay = reactive({
    name: "",
    costs: {} as [string, number][]
});

function build(name: string) {
    priceDisplay.name = buttonMap[name].friendly;
    priceDisplay.costs = Object.entries(costs[name] || {});

    state.interaction.placingBuilding = name
    //Preview
    k.add(
        [
            k.sprite(name),
            k.pos(),
            k.origin("center"),
            k.opacity(0.5),
            k.area(),
            {
                update() {
                    const building = this as PosComp;
                    building.moveTo(state.position as Vec2);
                    //Delete when not building
                    if (!state.interaction.placingBuilding) (this as any).destroy()
                }
            },
            "preview"
        ]
    )
}

window.addEventListener("keydown", ({ key }) => {
    if (key === "Escape") state.interaction.placingBuilding = null;
});
</script>

<style scoped>
.name-tooltip-container {
    width: 300px;
    bottom: 75px;
    position: fixed;
    opacity: 0;
    transition: opacity 0.25s, bottom 0.25s;
    background: #003366;
    padding: 10px;
    border-radius: 10px;
}

button:hover .name-tooltip-container {
    bottom: 100px;
    opacity: 1;
}

.hotbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 3;

    height: 100px;
    padding: 10px;

    display: flex;
    justify-content: center;
}

.placing-overlay {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 4;

    height: 110px;
    padding: 10px;

    pointer-events: all;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background: rgba(0, 0, 0, 0.9);
}

.placing-overlay img {
    height: 30px;
}

.placing-overlay h3 {
    display: flex;
    align-items: center;
}

.placing-overlay h3 > * {
    margin: 0 5px;
}

.placing-overlay hr {
    width: 50vw;
    margin: 5px 0;
}

button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 75px;
    height: 75px;
    border-radius: 50%;
    padding: 5px;
    margin: 0 5px;
    position: relative;
}

.iconify {
    font-size: 30px;
}
</style>