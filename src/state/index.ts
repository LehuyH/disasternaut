import { getCurrentInstance, reactive, computed } from 'vue'
import { Emitter, EventType } from 'mitt'
import k from "@/kaboom"
import Disaster from "@/kaboom/logic/disaster/disasterClass"
import { MapSave, exportMapState, respawnMap } from "@/kaboom/logic/map"
import createQuota from "@/kaboom/logic/quota"
import { startRandomDisaster } from "@/kaboom/logic/disaster"

export const wait = (s: number, callback: () => void) => setTimeout(() => callback(), s * 1000)

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
        quotaSuccess:false,
        showLetter:false,
        nextToBed:false,
        debtLetterShown:false,
        tutorialButtonPulsing: {
            "shelter": false,
            "nuclear_generator": false,
            "communications": false,
            "oxygen_tank": false
        } as Record<string, boolean>
    },
    persistent: {
        name:"",
        dayRespawned:0,
        maxHealth:5,
        health: 5,
        day: 0,
        hour: 12,
        numDisasters: 0,
        oxygen: 120,
        maxOxygen:120,
        failures:0,
        tools: [] as Tool[],
        quota:{} as Record<string,number>,
        quotaDay:null as number|null,
        requestMap: true as boolean,
        resources: {
        } as Record<string, number>,
        map: {
            extractables: [],
            buildings: [],
        } as MapSave,
        objectives: {
            survival: [] as Objective[],
            huge: [] as Objective[]
        } as Record<string, Objective[]>
    },
    scene: "onboarding",
    currentDiaster: null as null | Disaster,
    disasterTimer: 0,
    notis: [] as string[],
    newGame: true as boolean,

})


//This acts as a game loop function that will run every second
let onTutorial = true
function gameLoop() {
    if (state.scene === "death") return;

    const player = k.get("player")[0]

    //Spend Oxygen if Player is in shelter
    if (state.scene === "shelter") {
        state.persistent.oxygen--

        if (state.persistent.oxygen <= 0) {
            //Reset
            dmgPlayer(1)
        }

        //Respawn map if day passed
        if (state.persistent.dayRespawned !== state.persistent.day){
            respawnMap()
            state.persistent.dayRespawned = state.persistent.day
        }
    }

    //Game doesn't exist
    if (!player) return

    //Death!
    if (state.persistent.health <= 0) {
        state.persistent.health = 0
        setScene("death")
    }

    if (state.currentDiaster) {
        state.disasterTimer--
        //reset diaster if over
        if (state.disasterTimer <= 0) {
            state.currentDiaster.exit && state.currentDiaster.exit()
            state.currentDiaster.canceler && state.currentDiaster.canceler()
            state.currentDiaster = null
        }
    }

    k.setData("save",state.persistent)
    if(state.scene === "planet") exportMapState()


}


//This triggers the game loop function
k.add([
    k.stay(),
    {
        time: 0,
        nextHour: 0,
        //In game, 30 seconds = 1 hour
        secondsPerHour: 30,
        update() {
            this.time += k.dt()
            //Very second
            if (this.time >= 1) {
                gameLoop()
                this.time = 0
                this.nextHour++

                //Next hour
                if (this.nextHour >= this.secondsPerHour) {
                    state.persistent.hour++
                    this.nextHour = 0
                    const inDebt = (state.persistent.failures >= 3)
                      //Check quota if due or in debt
                    if ((state.persistent.quotaDay && state.persistent.quotaDay <= state.persistent.day) || inDebt){
                        const passed = Object.entries(state.persistent.quota).every(([key,target])=>{
                            const current = state.persistent.resources[key] || 0

                            return target <= current
                        })

                        if(!passed && !inDebt) state.persistent.failures++
                        if(passed){
                            //Reset failures
                            if(inDebt){
                                state.persistent.failures = 0
                                state.interaction.debtLetterShown = false
                            }
                            else state.persistent.failures = Math.max(state.persistent.failures - 1,0)

                            //Charge quota
                            Object.entries(state.persistent.quota).forEach(([key,target])=>{
                               state.persistent.resources[key] -= target
                            })
                        }

                        if(!state.interaction.debtLetterShown){
                            if(inDebt) state.interaction.debtLetterShown = true
                             //Show letter and lock player
                            k.get("player")[0].allowMovement = false
                            state.interaction.quotaSuccess = passed
                            state.interaction.showLetter = true
                            setQuota()
                        }

                    }

                    //Select random disaster and start it
                    if(!state.currentDiaster && state.persistent.numDisasters === 1 && onTutorial){
                        //Let new players get a longer first break before staring next disaster
                        onTutorial = false
                    }
                    else if(!state.currentDiaster && state.persistent.numDisasters > 0 &&!state.interaction.showLetter) startRandomDisaster()


                    //Is next day?
                    if (state.persistent.hour === 25) {
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
    if (state.scene === "planet") exportMapState()

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

export function removeObjective(type: string, name: string) {
    if (!state.persistent.objectives[type]) return

    const objectives = state.persistent.objectives[type]
    const index = objectives.findIndex(o => o.name === name)
    if (index == -1) return

    objectives.splice(index, 1)
}

export const matImageMap: Record<string, string> = {
    wood: "tree_1",
    metal: "metal_1",
    stone: "rock_1",
    uranium: "uranium_1",
}
export function dmgPlayer(damage: number = 1) {
    state.persistent.health -= damage
    k.play("hurt", {
        volume: 3
    })
    k.shake(2)
}

export function setQuota(){
     //Player is in debt
     if(state.persistent.failures >= 3){
        state.persistent.quota = {
            wood:100,
            metal:50,
            stone:40
        }
        state.persistent.quotaDay = Infinity
        notify("Your are in Debt to HUGE. Check your quota for details.")
        return;
     }

    const [quota, days] = createQuota()
    state.persistent.quota = quota as Record<string, number>
    state.persistent.quotaDay = state.persistent.day + (days as number)
    notify("HUGE has sent you a new Quota. You have " + days + " days")
}