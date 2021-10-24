<template>
    <div class="hotbar hud-element">
        <transition name="fade" tag="div">
            <div class="placing-overlay" v-if="state.interaction.placingBuilding !== null">
                <h3 class="thin">{{ priceDisplay }}</h3>
                <hr />
                <h4 class="thin">Hit Escape to stop placing</h4>
            </div>
        </transition>

        <button
            v-for="(cost, name, i) in costs"
            :key="i"
            @click="build(name)"
            style="--accent: #003366; --border: white;"
            :title="buttonMap[name].friendly"
        >
            <span class="iconify" :data-icon="buttonMap[name].icon"></span>
        </button>
    </div>
</template>

<script setup lang="ts">
import { state } from "@/state";
import { costs } from "@/kaboom/logic/buildings";
import k from "@/kaboom";
import { PosComp, Vec2 } from "kaboom";
import { ref } from "vue";

const buttonMap = {
    "nuclear_generator": {
        icon: "ion:nuclear-sharp",
        friendly: "Nuclear Generator",
    },
    "shelter": {
        icon: "ic:baseline-night-shelter",
        friendly: "Base Shelter",
    },
    "communications": {
        icon: "maki:communications-tower",
        friendly: "Communications Tower"
    },
    "oxygen_tank": {
        icon: "healthicons:oxygen-tank",
        friendly: "Oxygen Tank"
    }
} as Record<string, {
    icon: string;
    friendly: string;
}>

const priceDisplay = ref<string | null>(null);

function build(name: string) {
    priceDisplay.value = `${buttonMap[name].friendly} costs ${Object.entries(costs[name] || {})
        .map(([k, v]) => `${v}, ${k}`)
        .join(", ").trim() || "nothing"
        }`;

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
}

.iconify {
    font-size: 30px;
}
</style>