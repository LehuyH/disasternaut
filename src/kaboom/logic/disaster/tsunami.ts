import k from "@/kaboom"
import { GameObj } from "kaboom"
import { state } from "@/state"
import Disaster from "@/kaboom/logic/disaster/disasterClass"

interface TsunamiState{
    scaleX:number;
    opacity:number;
    timeIdle:number;
}

export default class Tsunami extends Disaster<TsunamiState>{
    name = "Tsunami"
    description = "A HUGE Tsunami has been detected. If you are unable to make it to the shelter, the safest calculated spot to be at is your far right."
    state = {
        scaleX:0,
        opacity:1,
        timeIdle:0
    }

    init(){
        const tsunamiState = this.state
        k.add([
            k.stay(),
            {
                update() {
                    //Move the Tsunami
                    if(tsunamiState.scaleX < 1){
                        tsunamiState.scaleX += 0.001;
                    }else{
                        //Idle for 5 seconds, then fade away
                        if(tsunamiState.opacity <= 0){
                            this.destroy();
                            return;
                        };

                        if(state.disasterTimer <= 0 && tsunamiState.opacity > 0){
                            tsunamiState.opacity -= 0.02
                        }
                    }
                    
                }
            } as any
        ])
    }

    planet(){
        //Add water
        const tsunamiState = this.state
        k.add([
            k.rect(2500,2000),
            k.color(38,107,126),
            k.pos(),
            k.area(),
            {
                update() {
                    this.use(k.scale(tsunamiState.scaleX,1))
                    this.use(k.opacity(tsunamiState.opacity))

                    if(tsunamiState.opacity <= 0){
                        this.destroy()
                    }
                }
            } as any
        ])

    }
    
}