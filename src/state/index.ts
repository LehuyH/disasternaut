import { getCurrentInstance, reactive,computed } from 'vue'
import { Emitter, EventType } from 'mitt'
import k from "@/kaboom"
import Disaster from "@/kaboom/logic/disaster/disasterClass"
import { MapSave,exportMapState, restoreMap } from "@/kaboom/logic/map"

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
        currentToolIndex: -1,
        showQuota: false,
    },
    persistent: {
        health:5,
        day:0,
        hour:12,
        numDisasters:0,
        oxygen:120,
        tools: [] as Tool[],
        resources: {
            uranium:2,
            metal:5
        } as Record<string, number>,
        map:{
            extractables:[],
            buildings:[],
        } as MapSave,
        objectives:{
            survival:[] as Objective[],
            huge:[] as Objective[]
        } as Record<string, Objective[]>
    },
    scene: "",
    currentDiaster: null as null | Disaster,
    disasterTimer:0,
    notis: [] as string[],
    newGame:true as boolean,  

})


//This acts as a game loop function that will run every second
function gameLoop(){
    if(state.scene === "death") return;

    const player = k.get("player")[0]
    
    //Spend Oxygen if Player is in shelter
    if(state.scene === "shelter"){
        state.persistent.oxygen--

        if(state.persistent.oxygen <= 0){
            //Reset
            dmgPlayer(1)
        }
    }

    //Game doesn't exist
    if(!player) return

    //Death!
    if(state.persistent.health <= 0){
        state.persistent.health = 0
        setScene("death")
    }

    if(state.currentDiaster){
        state.disasterTimer--
        //reset diaster if over
        if(state.disasterTimer <= 0){
            state.currentDiaster.exit && state.currentDiaster.exit()
            state.currentDiaster.canceler && state.currentDiaster.canceler()
            state.currentDiaster = null
        }
    } 
   


}


//This triggers the game loop function
k.add([
    k.stay(),
    {
        time:0,
        nextHour:0,
        //In game, 30 seconds = 1 hour
        secondsPerHour:30,
        update(){
            this.time += k.dt()
            //Very second
            if(this.time >= 1){
                gameLoop()
                this.time = 0
                this.nextHour++

                if(this.nextHour >= this.secondsPerHour){
                    state.persistent.hour++
                    this.nextHour = 0
                    //Is next day?
                    if(state.persistent.hour === 25){
                        state.persistent.hour = 0
                        state.persistent.day++
                    }
                }
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
    //If leaving planet save map
    if(state.scene === "planet") exportMapState()

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

export function removeObjective(type:string,name:string) {  
    if(!state.persistent.objectives[type]) return

    const objectives = state.persistent.objectives[type]
    const index = objectives.findIndex(o => o.name === name)
    if(index == -1) return

    objectives.splice(index,1)
}

export const matImageMap: Record<string, string> = {
    wood: "tree_1",
    metal: "metal_1",
    stone: "rock_1",
    uranium: "uranium_1",
}
export function dmgPlayer(damage: number=1){
    state.persistent.health -= damage
    k.play("hurt",{
        volume:3
    })
    k.shake(2)
}
