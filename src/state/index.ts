import { getCurrentInstance } from 'vue'
import {Emitter,EventType} from 'mitt'

export function getEvents() {
    const internalInstance = getCurrentInstance(); 
    const events = internalInstance?.appContext.config.globalProperties.events;

    return events as Emitter<Record<EventType, unknown>>;
}
