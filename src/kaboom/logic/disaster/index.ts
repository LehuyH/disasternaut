import k from "@/kaboom"
import { state } from "@/state"
import Disaster from "@/kaboom/logic/disaster/disasterClass"

//DisasterLogic Imports
import meteor from "./meteor"
import tsunami from "./tsunami"
import nuke from "./nuke"
import hugeBean from "./hugeBean"
import lava from "./lava"

export const disasters = {
    meteor,
    tsunami,
    nuke,
    hugeBean,
    lava
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

export function restoreDisaster() {
    //Was there a disaster running? Restore if so
    if (state.currentDiaster && state.disasterTimer > 0) {
        if (state.scene === "planet") state.currentDiaster.planet && state.currentDiaster.planet()
        else state.currentDiaster.interior && state.currentDiaster.interior()
    }
}