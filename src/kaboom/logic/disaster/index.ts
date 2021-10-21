import k from "@/kaboom"
import { state } from "@/state"
//DisasterLogic Imports
import meteor from "./meteor"


export const disasters = {
    meteor
} as Record<any,DisasterLogic>

export interface DisasterLogic{
    name:string;
    description:string;
    start(duration:number): void;
    exit():void
}


export function startDisaster(name:string,duration: number){
    if(disasters[name]){
            state.currentDiaster = disasters[name]
            state.persistent.numDisasters++
            disasters[name].start(duration)
    } 
}