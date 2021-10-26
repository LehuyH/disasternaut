import buildPlayer from "../objects/player"
import { state, addToLog } from "@/state"
import { generateMap, restoreMap, addExtractable } from "@/kaboom/logic/map"
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
    }

    //Requesting new game? Add Tutorial Objects
    if (state.newGame) {
        let newPlayer = k.get("player")[0]
        k.add([
            k.origin("center"),
            k.scale(0.35),
            k.z(2),
            k.text("Use WASD or Arrow keys to move"),
            k.pos(newPlayer.pos.sub(0,250)),
            {   
                //Remove on first disaster
                update() {
                    if(state.currentDiaster) this.destroy()
                }
            } as any
        ])

        addToLog({
            title:"HUGE launches a new ambitious Planetary Grant Program",
            description: "HUGE has just introduced the largest ever funding program to date to fund the next great space exploration discovery and development projects.\n\nWe are extremely excited to announce the launch of a new ambitious funding program dedicated to enabling new space discovery and development by all.\n\n“Humanity has spent the last century conquering our planet. Now, we need to set our sights on our galaxy.”\n\n-Rohn G. Jockerfeller HUGE\'s CFO\n\nAs Earth becomes more crowded, space exploration becomes a more pressing concern for humanity. HUGE has just launched a new ambitious funding program dedicated to enabling new space exploration discovery and colony establishment."
        })

        addExtractable({
            type:"uranium",
            gives:"uranium",
            value:1,
            health:10
        },newPlayer.pos.add(500,250),"uranium_1")

        k.add([
            k.origin("center"),
            k.scale(0.35),
            k.z(5),
            k.text("Hold down the left mouse buton"),
            k.pos(newPlayer.pos.add(500,300)),
            {   
                //Remove on first disaster
                update() {
                    if(state.currentDiaster) this.destroy()
                }
            } as any
        ])

        k.add([
            k.origin("center"),
            k.scale(0.35),
            k.z(5),
            k.text("to extract this resource"),
            k.pos(newPlayer.pos.add(500,350)),
            {   
                //Remove on first disaster
                update() {
                    if(state.currentDiaster) this.destroy()
                }
            } as any
        ])

        k.add([
            k.origin("center"),
            k.scale(0.35),
            k.z(5),
            k.text("You can build buildings using"),
            k.pos(newPlayer.pos.add(200,650)),
            {   
                //Remove on first disaster
                update() {
                    if(state.currentDiaster) this.destroy()
                }
            } as any
        ])
        k.add([
            k.origin("center"),
            k.scale(0.35),
            k.z(5),
            k.text("The buttons on the bottom of the screen"),
            k.pos(newPlayer.pos.add(200,700)),
            {   
                //Remove on first disaster
                update() {
                    if(state.currentDiaster) this.destroy()
                }
            } as any
        ])

        
        state.newGame = false
    }else{
        restoreMap()
    }

    //Requesting new map?
    if(state.persistent.requestMap){
        generateMap()
        state.persistent.requestMap = false
    }

    restoreDisaster()

    //Coliders
    //Top
    k.add([
        k.rect(4000, 2),
        k.pos(0, -2),
        k.area(),
        k.opacity(0),
        k.solid()
    ])
    //Bot
    k.add([
        k.rect(4000, 2),
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
