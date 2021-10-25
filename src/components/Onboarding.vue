<template>
    <transition name="fade">
        <div ref="rootDiv" class="onboarding overlay" v-if="state.scene === 'onboarding'">
            <transition name="bounce" mode="out-in">
                <div class="stage0" v-if="onboardingStage === 0">
                    <img src="/img/onboarding0.png" />
                    <h1>Disasternaut</h1>
                    <h2 class="thin">
                        Become a contractor for
                        <b>HUGE Incorporated</b>.
                        and expand the universe as we know it
                    </h2>
                    <br />
                    <div class="control-group">
                        <button
                            class="control"
                            style="--accent: var(--huge);"
                            @click="onboardingStage = 1"
                        >
                            <b>Start a New Game</b>
                        </button>
                        <button
                            class="control"
                            style="--accent: #3F3D56;"
                            @click="restore"
                            v-if="hasSave"
                        >
                            <b>Continue Saved Game</b>
                        </button>
                    </div>
                </div>
                <div class="stage1" v-else-if="onboardingStage === 1">
                    <img src="/img/onboarding1.svg" />
                    <h1>
                        HUGE
                        <span>inc.</span>
                    </h1>
                    <small>(Humans United on Galactic Exploration)</small>
                    <h2 class="thin">
                        Wants to outsource
                        <b>you</b> a newly discovered planet!
                    </h2>
                    <br />
                    <button
                        class="next-button"
                        style="--accent: var(--huge);"
                        @click="onboardingStage = 2"
                    >
                        <b>I'm Interested!</b>
                    </button>
                </div>
                <div class="stage2" v-else-if="onboardingStage === 2">
                    <img src="/img/onboarding2.svg" />
                    <h1>The opportunity of a lifetime!</h1>
                    <small>
                        <b>HUGE</b> (dba Humans United on Galactic Exploration inc.) offers you a planet
                        run entirely by you. HUGE pledges to provide you with all the resources that you
                        require to set up society on this newly discovered planet. However, you will need
                        to harvest and ship
                        <i>
                            natural resources (such as wood, metal, stone, and
                            <b>uranium</b>)
                        </i>
                        on said planet back to
                        <b>HUGE</b> to maintain ownership of this planet.
                    </small>

                    <hr />

                    <p>Please sign your name to certify this legally binding contract:</p>

                    <div class="control-group">
                        <input
                            class="control"
                            type="text"
                            placeholder="Sign here..."
                            v-model="state.persistent.name"
                        />

                        <button
                            class="control"
                            style="--accent: var(--huge);"
                            @click="startCurtainTransition"
                        >
                            <b>I agree</b>
                        </button>
                    </div>
                </div>
                <div class="stage3" v-else>
                    <div class="loading overlay">
                        <img src="/img/onboarding3.svg" />
                        <h1>Launching Rocket...</h1>
                    </div>

                    <div class="curtain">
                        <img
                            ref="leftCurtain"
                            src="/img/space-curtain.png"
                            :style="`transform: translateX(${curtainTranslates.left});`"
                        />
                        <img
                            ref="rightCurtain"
                            src="/img/space-curtain.png"
                            :style="`transform: translateX(${curtainTranslates.right}) scaleX(-1);`"
                        />
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { ref, reactive, watchEffect, computed } from 'vue';
import k from "@/kaboom";
import { state, setScene } from '@/state';
import { audio } from "@/state/audio"

audio.planet.play()

const onboardingStage = ref(0);

const rootDiv = ref<HTMLElement | null>(null);

const curtainTranslates = reactive({
    left: "-50vw",
    right: "50vw"
});

const hasSave = computed(() => k.getData("save") !== null)

function restore() {
    state.persistent = k.getData("save")
    state.newGame = false
    startCurtainTransition()
}

watchEffect(() => {
    if (onboardingStage.value === 0) {
        audio.planet.play()
        audio.planet.volume(0)
    }

    if (onboardingStage.value === 2) {
        audio.planet.fade(0, 1, 500)
    }

    if (onboardingStage.value === 3) {
        audio.planet.fade(1, 0, 1000)

        // 
        setTimeout(() => {
            audio.planet.stop()
            audio.planet.volume(0.2)

            audio.launch.fade(0, 0.2, 1000)
            audio.launch.play()

            setTimeout(() => {
                audio.launch.fade(0.2, 0, 1000)
                setTimeout(() => {
                    audio.launch.stop()
                    k.focus()
                }, 1000)
            }, 3000)
        }, 1100)
    }
})

function startCurtainTransition() {
    onboardingStage.value = 3;

    setTimeout(() => {
        curtainTranslates.left = "0";
        curtainTranslates.right = "0";

        setTimeout(() => {
            if (rootDiv.value) {
                rootDiv.value.style.background = "transparent";
            }
            curtainTranslates.left = "-50vw";
            curtainTranslates.right = "50vw";

            setTimeout(() => setScene("planet"), 500)
        }, 3000)
    }, 1000);
}
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

.onboarding > div {
    width: 600px;
    transition: transform 0.25s;
    max-width: 100vw;
}

@media screen and (max-height: 750px) {
    .onboarding > div {
        transform: scale(0.9);
    }
}

.stage0 {
    width: 750px !important;
}

.stage0 img {
    height: 40vh;
    margin-bottom: -40px;
}

.stage0 h1 {
    font-size: 100px;  
    color: var(--huge);
}

.stage1 h1 {
    font-size: 150px;
    color: var(--huge);
}
.stage1 h1 span {
    font-size: 75px;
    margin-left: -20px;
}

.stage1 small {
    display: block;
    margin-top: -20px;
    margin-bottom: 10px;
}

.stage1 .next-button {
    font-size: 30px;
    padding: 10px 20px;
    border-radius: 50px;
    margin-top: 20px;
}

.stage2 input {
    padding: 10px;
    color: var(--huge);
    background: transparent;
    border: 2px var(--huge) solid;
    text-align: center;
    margin-top: 15px;
    font-size: 1rem;
    min-width: 300px;
}

.stage2 small {
    display: block;
    margin-top: 20px;
    line-height: 25px;
}

.stage3 {
    position: relative;
}

.stage3 .loading {
    z-index: 8;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.stage3 .loading h1 {
    position: relative;
    font-size: 75px;
    animation: loading-text 3s 1s forwards;
}
.stage3 .loading img {
    position: relative;
    animation: rocket-shake 0.8s infinite, rocket-launch 3s 1s forwards;
}

.stage3,
.stage3 .curtain {
    width: 100% !important;
    height: 100%;
}

.stage3 .curtain img {
    height: 100%;
    width: 50%;
    transition: transform 0.5s ease-in-out;
}

img {
    height: 30vh;
}

hr {
    margin: 25px 0;
    border: none;
    border-bottom: 2px solid white;
    border-color: white;
}

.next-button {
    box-shadow: 0 0 0 0 #f2440585;
    animation: pulse 1.5s infinite;
    cursor: pointer;
}

@keyframes rocket-shake {
    0% {
        -webkit-transform: translate(2px, 1px) rotate(0deg);
    }
    10% {
        -webkit-transform: translate(-1px, -2px) rotate(-1deg);
    }
    20% {
        -webkit-transform: translate(-3px, 0px) rotate(1deg);
    }
    30% {
        -webkit-transform: translate(0px, 2px) rotate(0deg);
    }
    40% {
        -webkit-transform: translate(1px, -1px) rotate(1deg);
    }
    50% {
        -webkit-transform: translate(-1px, 2px) rotate(-1deg);
    }
    60% {
        -webkit-transform: translate(-3px, 1px) rotate(0deg);
    }
    70% {
        -webkit-transform: translate(2px, 1px) rotate(-1deg);
    }
    80% {
        -webkit-transform: translate(-1px, -1px) rotate(1deg);
    }
    90% {
        -webkit-transform: translate(2px, 2px) rotate(0deg);
    }
    100% {
        -webkit-transform: translate(1px, -2px) rotate(-1deg);
    }
}

@keyframes rocket-launch {
    0% {
        bottom: 0;
    }
    100% {
        bottom: 100vh;
    }
}

@keyframes loading-text {
    0% {
        opacity: 1;
        bottom: 0;
    }

    40% {
        bottom: 10vh;
    }

    80% {
        opacity: 1;
        bottom: 10vh;
    }

    100% {
        opacity: 0;
        bottom: 150px;
    }
}

.bounce-enter-active {
    animation: bounce-in 0.75s;
}
.bounce-leave-active {
    animation: bounce-out 0.75s;
}

@keyframes bounce-in {
    0% {
        transform: scale(0.9);
        opacity: 0;
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}
@keyframes bounce-out {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(0.9);
        opacity: 0;
    }
}
</style>