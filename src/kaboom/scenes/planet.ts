import { KaboomCtx } from "kaboom"
//Scene Loader

export default function (k:KaboomCtx){
    k.scene("planet",()=>{
        k.add([
            k.rect(100000, 100000),
            k.color(0, 0, 0),
            k.fixed(),
            k.pos(0,0)
    
        ]);
    })
}