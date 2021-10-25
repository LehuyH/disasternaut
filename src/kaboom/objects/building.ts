import k from "@/kaboom"
import { GameObj, Vec2, Rect } from "kaboom"

//Markup
export default (buildingName: string, position: Vec2) => [
    k.sprite(buildingName),
    k.pos(position.x, position.y),
    k.solid(),
    k.area(),
    k.origin("center"),
    behavior(buildingName),
    buildingName,
    {
        buildingName
    },
    "building",
    "collideable"
]


//Logic
function behavior(buildingName: string) {
    return {
        id: "building"
    } as any as GameObj<unknown>
}


//Style
k.loadSprite("shelter", "buildings/shelter.png")
k.loadSprite("oxygen_tank", "buildings/oxygen_tank.png")
k.loadSprite("nuclear_generator", "buildings/nuclear_generator.png")
k.loadSprite("communications", "buildings/communications.png")



