import kaboom, { KaboomCtx } from "kaboom";


const instance = {
    k: null as unknown as KaboomCtx,
}

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
    })


    planet(instance.k)


}


export default instance;


