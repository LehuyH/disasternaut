import k from "@/kaboom"
import { state } from "@/state"
import Disaster from "@/kaboom/logic/disaster/disasterClass"

//DisasterLogic Imports
import meteor from "./meteor"
import tsunami from "./tsunami"
import nuke from "./nuke"
import hugeBean from "./hugeBean"
import lava from "./lava"
import lazer from "./lazer"

export const disasters = {
    meteor,
    tsunami,
    nuke,
    hugeBean,
    lava,
    lazer
} as Record<any, Disaster>

export function startDisaster(name: string, duration: number) {
    if (disasters[name]) {
        //Create and mount the disaster
        const disaster = new (disasters[name] as any) as Disaster
        state.persistent.numDisasters++
        state.currentDiaster = disaster
        state.disasterTimer = duration

        //Lifecycle
        disaster.init && disaster.init()

        if (state.scene === "planet") disaster.planet && disaster.planet()
        else disaster.interior && disaster.interior()
    }
}

let lastDisaster = null as null|string

export function startRandomDisaster(){
    const disasterDurations = {
        "lava":10,
        "tsunami":10,
        "lazer":10,
    } as Record<string,number>

    //Select random disaster, NOT the last one
    const disasterName = k.choose(Object.keys(disasters).filter(k=>k!=lastDisaster))
    startDisaster(disasterName,disasterDurations[disasterName] || 25) 

    lastDisaster = disasterName
}

export function restoreDisaster() {
    //Was there a disaster running? Restore if so
    if (state.currentDiaster && state.disasterTimer > 0) {
        if (state.scene === "planet") state.currentDiaster.planet && state.currentDiaster.planet()
        else state.currentDiaster.interior && state.currentDiaster.interior()
    }
}