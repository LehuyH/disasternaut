import k from "@/kaboom"
import { AudioPlay, GameObj, Vec2 } from "kaboom"
import { state, dmgPlayer } from "@/state"
import Disaster from "@/kaboom/logic/disaster/disasterClass"

interface TornadoState {
    position: Vec2;
    target: Vec2;
    radius: number;
}

function inCircle(playerPos: Vec2, circlePos: Vec2, radius: number) {
    const dist = (playerPos.x - circlePos.x) * (playerPos.x - circlePos.x) + (playerPos.y - circlePos.y) * (playerPos.y - circlePos.y);
    radius *= radius;

    if (dist < radius) return true;

    return false;
}

export default class Nuke extends Disaster<TornadoState>{
    name = "Tornado"
    description = "A HUGE Tornado has been detected. If you see its clouds, move in a different direction!"

    state = {
        position: k.vec2(k.rand(0,5000),k.rand(0,2000)),
        target: k.vec2(k.rand(0,5000),k.rand(0,2000)),
        radius: 1,
        sfx:k.play("tornado",{loop:true})
    }

    init(){
        const tornadoState = this.state
        k.add([
            k.stay(),
            {
                update() {

                    if (!state.currentDiaster || state.scene === "death") {
                        tornadoState.sfx.stop()
                        this.destroy()
                    }

                }
            } as any
        ])
    }

    planet(){
        const tornadoState = this.state
        tornadoState.sfx.volume(1)
        let cooldown = false
        //Tornado body
        const tornado = k.add([
            k.pos(tornadoState.position),
            k.sprite("tornado"),
            k.origin("center"),
            k.rotate(0),
            k.z(5),
            {
                update() {
                    //Get new target
                    const player = k.get("player")[0]
                    if(this.pos.dist(tornadoState.target) <= 1) tornadoState.target = k.vec2(k.rand(0,5000),k.rand(0,2000))
                    this.moveTo(tornadoState.target,400)

                    tornadoState.position = this.pos
                    
                    k.shake(2)

                    if (!state.currentDiaster || state.scene === "death") {
                        //Shrink out
                        if(tornadoState.radius > 0) tornadoState.radius -= 1000 * k.dt()
                        else this.destroy()
                   }else{
                        if(tornadoState.radius < 700) tornadoState.radius += 500 * k.dt()
                   }

                   this.use(k.scale((tornadoState.radius/700 * 2.5)))

                   if(inCircle(player.pos,tornadoState.position,tornadoState.radius) && !cooldown){
                        dmgPlayer(1)
                        cooldown = true
                        k.wait(1,()=>cooldown=false)
                    }

                    this.angle += 100 * k.dt()

                }
            } as any
        ])
    }

    interior() {
        this.state.sfx.volume(0.5)
        k.add([
            {
                update(){
                    k.shake(1)
                    if (!state.currentDiaster || state.scene === "death") {
                         this.destroy()
                   }
                }
            } as any
        ])
    }

    
}

k.loadSound("tornado", "audio/tornado.webm")
k.loadSprite("tornado", "sprites/tornado.png")