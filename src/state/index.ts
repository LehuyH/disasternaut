import { getCurrentInstance, reactive } from 'vue'
import { Emitter, EventType } from 'mitt'
import k from "@/kaboom"
import { DisasterLogic } from '@/kaboom/logic/disaster';
import { MapSave,exportMapState, restoreMap } from "@/kaboom/logic/map"
import { stat } from 'fs/promises';

export const wait = (s:number,callback:() => void) => setTimeout(() =>callback(),s*1000)

export interface Tool {
    name: string;
    spriteName: string;
    power: number;
    effective: string[]
}

export interface Objective {
    name: string;
    description: string;
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
        numDisasters:0,
        tools: [] as Tool[],
        resources: {

        } as Record<string, number>,
        map:{
            extractables:[],
            buildings:[],
        } as MapSave,
        objectives:[] as Objective[],
    },
    scene: "",
    currentDiaster: null as null | DisasterLogic,
    disasterTimer:0,
    notis: [] as string[],
    newGame:true as boolean,  

})


//This acts as a game loop function that will run every second
function gameLoop(){
    const player = k.get("player")[0]

    //Game doesn't exist
    if(!player) return

    if(state.currentDiaster) state.disasterTimer--
    
    console.log("hi")


}


//This triggers the game loop function
k.add([
    k.stay(),
    {
        time:0,
        update(){
            this.time += k.dt()
            if(this.time >= 1){
                gameLoop()
                this.time = 0
            }
        }
    } as any
])

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

