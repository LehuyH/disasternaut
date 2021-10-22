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
    /** Logic to run when outside */
    planet(duration:number): void;
    /** Logic to run when inside */
    interior(duration:number): void;
    exit():void
}




export function startDisaster(name:string,duration: number){
    if(disasters[name]){
            state.currentDiaster = disasters[name]
            state.disasterTimer = duration
            state.persistent.numDisasters++
            
            
            if(state.scene === "planet"){
                disasters[name].planet(duration)
            }else{
                disasters[name].interior(duration)
            }
    } 
}