import k from "@/kaboom"
import { AudioPlay, GameObj, Vec2 } from "kaboom"
import { state, dmgPlayer } from "@/state"
import Disaster from "@/kaboom/logic/disaster/disasterClass"

interface LazerState {

}

export default class Nuke extends Disaster<LazerState>{
    name = "Huge Lazer"
    description = "A HUGE energy leakage resembling a lazer has been detected. If you are in it's path MOVE AWAY."

    planet(){
        const player = k.get("player")[0]
        this.canceler = k.loop(1,()=>{
            const y = player.pos.y
            let time = 0

            //Warning
            const warning = k.add([
                k.origin("center"),
                k.rect(6000,100),
                k.pos(0,y),
                k.color(183,18,19),
                k.opacity(0.3),
                k.lifespan(1.5,{fade:1}),
                {
                    update() {
                        time += k.dt()
                    }
                }
            ])

            //Lazer
            let playedSfx = false
            let cooldown = false
            const lazer = k.add([
                k.origin("left"),
                k.rect(0,100),
                k.pos(0,y),
                k.color(k.randi(50,230),k.randi(50,230),k.randi(50,230)),
                k.opacity(1),
                k.area(),
                k.lifespan(1,{fade:0.1}),
                {
                    add(){
                        this.collides("player",()=>{
                            if(!cooldown) dmgPlayer(1)
                            else{
                                cooldown = true
                                wait(1,()=>cooldown=false)
                            }
                        })
                    },
                    update() {
                    //after 1 seconds, shoot
                       if(time >= 0.5){
                            k.shake(1)
                            this.width += 8000 * k.dt()

                            if(!playedSfx){
                                playedSfx = true
                                k.play("lazer")
                            }
                        }
                    }
                } as any
                    
                
            ])
        })
    }

    interior(){
        this.canceler = k.loop(1,()=>{
            k.play("lazer",{volume:0.25})
            k.shake(1)
        })
    }


    
}

k.loadSound("lazer", "audio/lazer.webm")