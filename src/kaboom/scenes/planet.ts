import { KaboomCtx } from "kaboom"
import buildPlayer from "../objects/player"
import k from "@/kaboom"


k.scene("planet",()=>{
    k.add([
        k.sprite("ground",{
            tiled:true,
            width:2500,
            height:2000
        })
    ])

    k.add(
        [
            ...buildPlayer(),
            k.pos(1800,900)
        ]
    )
})


k.loadSprite("ground","tiles/ground_large.png")
