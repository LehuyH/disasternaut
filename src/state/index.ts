import { getCurrentInstance, reactive } from 'vue'
import { Emitter, EventType } from 'mitt'
import { KaboomCtx } from 'kaboom';
import k from "@/kaboom"
import { DisasterLogic } from '@/kaboom/logic/disaster';

export interface Tool {
    name: string;
    spriteName: string;
    power: number;
    effective: string[]
}

export function getEvents() {
    const internalInstance = getCurrentInstance();
    const events = internalInstance?.appContext.config.globalProperties.events;

    return events as Emitter<Record<EventType, unknown>>;
}

export const state = reactive({
    interaction: {
        placingBuilding: null as null | string,
        currentToolIndex: -1
    },
    persistent: {
        tools: [] as Tool[],
        resources: {

        } as Record<string, number>
    },
    scene: "",
    currentDiaster: null as null | DisasterLogic,
    notis: [] as string[]

})

export function setScene(scene: string) {
    k.go(scene)
    state.scene = scene

    //Logic to save overworld state
}

export function addTool(tool: Tool) {
    state.persistent.tools.push(tool)
}

export function getActiveTool(): Tool | null {
    const tool = state.persistent.tools[state.interaction.currentToolIndex]
    if (!tool) return null
    return tool
}

export function setTool(index: number): Tool | null {
    const tool = state.persistent.tools[index]
    if (!tool) return null

    state.interaction.currentToolIndex = index
    return tool
}

export function notify(text: string) {
    console.log(text);
    state.notis.push(text);
    setTimeout(() => state.notis.shift(), 3000);
}
