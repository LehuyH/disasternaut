import { getCurrentInstance, reactive } from 'vue'
import { Emitter, EventType } from 'mitt'
import k from "@/kaboom"
import { DisasterLogic } from '@/kaboom/logic/disaster';
import { MapSave,exportMapState, restoreMap } from "@/kaboom/logic/map"

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
    canvas: document.querySelector("canvas"),
    position: k.mouseWorldPos(),
    interaction: {
        placingBuilding: null as null | string,
        currentToolIndex: -1
    },
    persistent: {
        tools: [] as Tool[],
        resources: {

        } as Record<string, number>,
        map:{
            extractables:[],
            buildings:[],
        } as MapSave
    },
    scene: "",
    currentDiaster: null as null | DisasterLogic,
    notis: [] as string[],
    newGame:true as boolean,  

})

const updatePos = ({ offsetX, offsetY }: MouseEvent) => {
    state.position = k.mouseWorldPos();
};
state.canvas?.addEventListener("mousemove", updatePos);
state.canvas?.addEventListener("mouseover", updatePos);


export function setScene(scene: string) {
     //Logic to save overworld state
    if(state.scene === "planet")  exportMapState()

    k.go(scene)
    state.scene = scene

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
