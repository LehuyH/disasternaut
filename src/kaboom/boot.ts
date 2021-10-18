import kaboom from "kaboom";
import { instance } from "./index"

//Loaders
import planet from "./scenes/planet"

export function createInstance(canvas:HTMLCanvasElement ){

    instance.k = kaboom({
        width:1920,
        height:1080,
        global:false,
        stretch:true,
        canvas,
        background:[32,31,53]
    });

    //DEBUG
    (window as any).k = instance.k

    //Load assets
    instance.k.loadSprite("player","sprites/player.png",{
        sliceX:3,
        sliceY:4,
        anims:{
            down:{
                from:0,
                to:2,
            },
            left:{
                from:3,
                to:5
            },
            right:{
                from:6,
                to:8
            },
            up:{
                from:8,
                to:12
            }
        }
    })

    instance.k.ready(()=>{
        planet(instance.k)
        instance.k.go("planet")
    })


}




