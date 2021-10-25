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
import tornado from "./tornado"

export const disasters = {
    meteor,
    tsunami,
    nuke,
    hugeBean,
    lava,
    lazer,
    tornado
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

let disasterQueue = shuffle(Object.keys(disasters))
export function startRandomDisaster(){
    //If queue is empty, remake
    if(disasterQueue.length === 0) disasterQueue = shuffle(Object.keys(disasters))

    const disasterDurations = {
        "lava":10,
        "tsunami":10,
        "lazer":10,
    } as Record<string,number>
    

    //Select random disaster from queue
    const disasterName = k.choose(disasterQueue)

    startDisaster(disasterName,disasterDurations[disasterName] || 25) 

    //Remove from queue
    disasterQueue = disasterQueue.filter(n=>n!=disasterName)

}

export function restoreDisaster() {
    //Was there a disaster running? Restore if so
    if (state.currentDiaster && state.disasterTimer > 0) {
        if (state.scene === "planet") state.currentDiaster.planet && state.currentDiaster.planet()
        else state.currentDiaster.interior && state.currentDiaster.interior()
    }
}

function shuffle(array:any[]) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
  