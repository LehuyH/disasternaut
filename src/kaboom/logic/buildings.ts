import k from "@/kaboom"
import { state, notify } from "@/state";
import { exportMapState } from "@/kaboom/logic/map"
import { Rect, GameObj, Vec2 } from "kaboom"
import createBuilding from "@/kaboom/objects/building"

export const costs = {
    "shelter": null,
    "nuclear_generator": {
        uranium: 1,
    },
    "communications": {
        metal: 5
    },
    "oxygen_tank":{
        metal: 20,
        wood:30
    },
} as Record<string, Record<string, number> | null>


export function allowedToBuild(buildingName: string): (boolean | string | null)[] {
    const preview = k.get("preview")[0]
    const shelter = k.get("shelter")[0]

    //No collisions
    if (!preview ||(isTouchingCollideable(preview) || preview.pos.x < 0 || preview.pos.y < 0 || preview.pos.x > 3600 || preview.pos.y > 2000)) return [false, "There is not enough room to build this here."]


    //Only build on overworld world
    if (state.scene !== "planet") return [false, "You cannot build inside here!"];

    //Only one shelter
    if (buildingName === "shelter") return (shelter !== undefined) ? [false, "You can only have one shelter!"] : [true]


    //All buildings need shelter
    if (!shelter) return [false, "You need to build a shelter first!"]

    //Check cost
    if (!hasCost(buildingName)) return [false, "You do not have enough resources to build this."]

    const cost = costs[buildingName];

    cost && Object.entries(cost).forEach(([name, cost]) => {
        state.persistent.resources[name] -= cost
    })

    return [true, "Built successfully!"];
}

export function hasCost(name: string): boolean {
    const cost = costs[name]

    //Does not exist? Free!
    if (!cost) return true;

    return Object.entries(cost).every(([name, cost]) => {
        const playerCount = (state.persistent.resources[name]) ? state.persistent.resources[name] : 0

        return playerCount >= cost
    })
}

function isTouchingCollideable(preview: GameObj<any>): boolean {
    if (!preview) return false;
    let touch = false
    k.every("collideable", collide => {
        const touchCheck = isTouching(preview.worldArea(), collide.worldArea())
        if (touchCheck) touch = true
    })

    return touch
}

function isTouching(r1: Rect, r2: Rect): boolean {
    return r1.p2.x > r2.p1.x
        && r1.p1.x < r2.p2.x
        && r1.p2.y > r2.p1.y
        && r1.p1.y < r2.p2.y;
}

const buildingCallbacks = {
    "oxygen_tank": ()=>{
        const numTanks = k.get("oxygen_tank").length
        //Set max oxygen (20 per oxygen)
        state.persistent.maxOxygen = 120 + (numTanks * 20)
    }

} as Record<string,() => void>

export function addBuilding(name: string,pos:Vec2,force=false){
    const [allowed, msg] = allowedToBuild(name)
    
    if (allowed || force) {
        state.interaction.tutorialButtonPulsing[name] = false;
        (new Audio("/audio/hover.webm")).play();
        k.add(createBuilding(name, pos))
        state.interaction.placingBuilding = null;
        const callback = buildingCallbacks[name]
        callback && callback()
        exportMapState()
    } else {
        notify(msg as string)
    }
}