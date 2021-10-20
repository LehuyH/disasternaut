import map from "@/kaboom/logic/map"
import buildPlayer from "../objects/player"
import k from "@/kaboom"

const level = map.generateMap({
    worldWidth:14,
    worldHeight:25,
    birthLimit:6,
    deathLimit:3,
    numberOfSteps:8,
    chanceToStartAlive:0.4
})
//Padding



k.scene("planet",()=>{
    k.add([
        k.sprite("ground",{
            tiled:true,
            width:2500,
            height:2000
        })
    ])

    k.addLevel(level,{
        width:128,
        height:128,
        "1": () => [
            k.sprite(`tree_${k.choose(["1","2"])}`),
            k.solid(),
            k.origin("center"),
            k.area({ scale:0.3}),
            k.z(1),
            "collideable"

        ]
    }as any)

    k.add(
        [
            ...buildPlayer(),
            k.pos(1800,900)
        ]
    )
})


k.loadSprite("ground","tiles/ground_large.png")
k.loadSprite("tree_1","sprites/tree_1.png")
k.loadSprite("tree_2","sprites/tree_2.png")

