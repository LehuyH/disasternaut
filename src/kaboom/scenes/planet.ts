import { KaboomCtx } from "kaboom"
import buildPlayer from "../objects/player"
import k from "@/kaboom"

k.scene("planet",()=>{
    k.add(
        buildPlayer()
    )
})