import { getCurrentInstance, reactive } from 'vue'
import {Emitter,EventType} from 'mitt'
import { KaboomCtx } from 'kaboom';
import k from "@/kaboom"

export function getEvents() {
    const internalInstance = getCurrentInstance(); 
    const events = internalInstance?.appContext.config.globalProperties.events;

    return events as Emitter<Record<EventType, unknown>>;
}

export const state = reactive({
    interaction:{
        placingBuilding:null as null|string
    },
    scene:""
    
})

export function setScene(scene:string){
    k.go(scene)
    state.scene = scene

    //Logic to save overworld state
}
