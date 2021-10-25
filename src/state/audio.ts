import { Howl, Howler } from 'howler';
import { watchEffect } from "vue"
import { state } from "@/state"
import k from '@/kaboom';

let current = null as null | Howl
let currentIsDisaster = false

const hoverableTags = ["SUMMARY", "A", "BUTTON"];

const checkIfInteractive = (el: HTMLElement | null) => {
    if (!el) return false;
    let tag = el.nodeName;

    while (tag !== "BODY") {
        if (hoverableTags.includes(tag)) return true;
        if (el?.parentNode) {
            el = el.parentNode as HTMLElement;
            tag = el.nodeName;
        }
    }

    return false;
}

window.addEventListener("mousedown", ({ target }) => {
    if (checkIfInteractive(target as HTMLElement)) {
        (new Audio("/audio/hover.webm")).play();
    }
})

export const audio = {
    planet: new Howl({
        src: "audio/Space Jazz.webm",
        loop: true,
        volume: 0.2
    }),
    interior: new Howl({
        src: "audio/Nightdreams.webm",
        loop: true,
        volume: 0.2
    }),
    death: new Howl({
        src: "audio/piano.webm",
        loop: true,
        volume: 2
    }),
    disasters: {
        0: new Howl({
            src: "audio/disaster_0.webm",
            loop: true,
            volume: 0.2
        }),
        1: new Howl({
            src: "audio/disaster_1.webm",
            loop: true,
            volume: 0.2
        }),
        2: new Howl({
            src: "audio/disaster_2.webm",
            loop: true,
            volume: 0.2
        }),
        3: new Howl({
            src: "audio/disaster_3.webm",
            loop: true,
            volume: 0.2
        })
    } as Record<number, Howl>,
    launch: new Howl({
        src: "audio/launch.webm",
        loop: true,
        volume: 0.5,
    })
}

export function playDisasterAudio() {
    if (currentIsDisaster) return;
    currentIsDisaster = true
    const index = k.randi(0, Object.keys(audio.disasters).length - 1)
    current?.stop()

    current = audio.disasters[index]
    current.play()
    current.fade(0, current.volume(), 1000)
}

export function playBgAudio() {
    const audioByScene = {
        'onboarding': audio.planet,
        'planet': audio.planet,
        'shelter': audio.interior,
        'death': audio.death,
    } as Record<string, Howl>

    current?.stop()
    const bg = audioByScene[state.scene]
    current = bg
    bg.play()
    bg.fade(0, bg.volume(), 1000)
    currentIsDisaster = false
}