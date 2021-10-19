import k from "@/kaboom"
import { Character, Vec2, Rect } from "kaboom"

//Markup
export default (buildingName:string,position:Vec2) => [
    k.sprite(buildingName),
    k.pos(position.x,position.y),
    k.solid(),
    k.area(),
    k.origin("center"),
    behavior(buildingName),
    buildingName,
    "building"
]


//Logic
function behavior(buildingName:string){
    return{
        id:"building",
        
    } as any as Character<unknown>
}


//Style
k.loadSprite("shelter","buildings/shelter.png")
k.loadSprite("nuclear_generator","buildings/nuclear_generator.png")



