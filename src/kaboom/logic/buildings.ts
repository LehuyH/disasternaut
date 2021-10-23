import k from "@/kaboom"
import { state, notify } from "@/state";
import { exportMapState } from "@/kaboom/logic/map"
import { Rect, GameObj, Vec2 } from "kaboom"
import createBuilding from "@/kaboom/objects/building"

export const costs = {
    "nuclear_generator":{
        uranium:2,
        metal:5
    },
    "communications":{
        metal:10
    }
} as Record<string,Record<string, number>>

export function allowedToBuild(buildingName:string):(boolean|string|null)[] {
    const preview = k.get("preview")[0]
    const shelter = k.get("shelter")[0]

     //No collisions
     if(isTouchingCollideable(preview)) return [false, "There is not enough room to build this here."]

    //Only build on overworld world
    if(state.scene !== "planet") return [false,"You cannot build here!"];

    //Only one shelter
    if(buildingName === "shelter") return (shelter !== undefined) ?  [false, "You can only have one shelter!"] : [true]


    //All buildings need shelter
    if(!shelter) return [false, "You need to build a shelter first!"]

    //Check cost
    if(!hasCost(buildingName)) return [false, "You do not have enough resources to build this."]

    //Distance
    if(buildingName === "nuclear_generator"){
        const distFromShelter = k.mouseWorldPos().dist(shelter.pos)
  
        if(distFromShelter < 500) return [false,"You must place Nuclear Generators further from the shelter!"]
    }
    
    const cost = costs[buildingName]

    Object.entries(cost).forEach(([name,cost])=>{
        state.persistent.resources[name] -= cost
    })

    return [true];
}

export function hasCost(name:string):boolean {
    const cost = costs[name]

    //Does not exist? Free!
    if(!cost) return true;

    return Object.entries(cost).every(([name,cost])=>{
        const playerCount = (state.persistent.resources[name]) ? state.persistent.resources[name] : 0

        return playerCount >= cost
    })
}

function isTouchingCollideable(preview:GameObj<any>): boolean {
    if(!preview) return false;
    let touch = false
    k.every("collideable",collide=>{
        const touchCheck = isTouching(preview.worldArea(),collide.worldArea())
        if(touchCheck) touch = true
    })

    return touch
}

function isTouching(r1: Rect, r2: Rect): boolean {
	return r1.p2.x > r2.p1.x
		&& r1.p1.x < r2.p2.x
		&& r1.p2.y > r2.p1.y
		&& r1.p1.y < r2.p2.y;
}

export function addBuilding(name: string,pos:Vec2,force=false){
    const [allowed, msg] = allowedToBuild(name)


    if (allowed || force) {
        k.add(createBuilding(name, pos))
        state.interaction.placingBuilding = null;
        exportMapState()
    } else {
        notify(msg as string)
    }
}