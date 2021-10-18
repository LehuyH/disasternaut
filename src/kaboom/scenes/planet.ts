import { KaboomCtx } from "kaboom"
import buildPlayer from "../objects/player"

//Scene Loader
export default function (k:KaboomCtx){
    
    k.scene("planet",()=>{
       k.add([buildPlayer(k)])
    })
}