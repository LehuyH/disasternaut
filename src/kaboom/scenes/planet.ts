import buildPlayer from "../objects/player"
import { state } from "@/state"
import { generateMap, restoreMap } from "@/kaboom/logic/map"
import k from "@/kaboom"
import { restoreDisaster } from "@/kaboom/logic/disaster"

k.scene("planet", () => {
    k.add([
        k.sprite("ground", {
            tiled: true,
            width: 2500,
            height: 2000
        })
    ])

    //Requesting new game? Create new map
    if (state.newGame) {
        state.newGame = false
        generateMap()
    }

    const player = k.get("player")[0]
    if (!player) {
        //No Player, add it
        k.add(
            [
                ...buildPlayer(),
                k.pos(1800, 900)
            ]
        )
    } else {
        const shelter = state.persistent.map.buildings.find(b => b.name === "shelter")
        if (!shelter) return
        player.moveTo(shelter.pos.x, shelter.pos.y + 200)
        restoreMap()
    }

    restoreDisaster()

    //Coliders
    //Top
    k.add([
        k.rect(2500, 2),
        k.pos(0, -2),
        k.area(),
        k.opacity(0),
        k.solid()
    ])
    //Bot
    k.add([
        k.rect(2500, 2),
        k.pos(0, 2000 - 2),
        k.area(),
        k.opacity(0),
        k.solid()
    ])
    //Left
    k.add([
        k.rect(2, 2000),
        k.pos(-2, 0),
        k.area(),
        k.opacity(0),
        k.solid()
    ])
    //right
    k.add([
        k.rect(2, 2000),
        k.pos(3600, 0),
        k.area(),
        k.opacity(0),
        k.solid()
    ])
})

const loadVariants = (type: string, count: number, extension: string = "png") => {
    [...Array(count)].forEach((x, i) => {
        k.loadSprite(`${type}_${i + 1}`, `sprites/${type}_${i + 1}.${extension}`)
    })
}

k.loadSprite("ground", "tiles/ground_large.png")
loadVariants("tree", 2)
loadVariants("rock", 4)
loadVariants("metal", 4)
loadVariants("uranium", 2)
