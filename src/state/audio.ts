import { Howl, Howler } from 'howler';
import { watchEffect } from "vue"
import { state } from "@/state"
import k from '@/kaboom';

let current = null as null | Howl

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
    disasters: {
        0: new Howl({
            src: "audio/disaster_0.webm",
            loop: true,
            volume: 0.2
        })
    } as Record<number, Howl>
}

export function playDisasterAudio() {
    const index = k.randi(0, Object.keys(audio.disasters).length - 1)
    current?.stop()

    current = audio.disasters[index]
    current.play()
    current.fade(0, current.volume(), 1000)
}

export function playBgAudio() {
    current?.stop()
    const bg = (state.scene === "planet") ? audio.planet : audio.interior
    current = bg
    bg.play()
    bg.fade(0, bg.volume(), 1000)
}