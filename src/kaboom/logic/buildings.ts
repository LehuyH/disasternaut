import k from "@/kaboom"
import { state, notify } from "@/state";
import { Rect, GameObj, Vec2 } from "kaboom"
import createBuilding from "@/kaboom/objects/building"

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

    if(buildingName === "nuclear_generator"){
        const distFromShelter = k.mouseWorldPos().dist(shelter.pos)
  
        if(distFromShelter < 500) return [false,"You must place Nuclear Generators further from the shelter!"]

        return [true]
    }
    


    return [true];
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

export function addBuilding(name: string,pos:Vec2){
    const [allowed, msg] = allowedToBuild(name)


    if (allowed) {
        k.add(createBuilding(name, pos))
        state.interaction.placingBuilding = null;
    } else {
        notify(msg as string)
    }
}