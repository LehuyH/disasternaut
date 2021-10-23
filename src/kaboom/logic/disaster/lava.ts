import k from "@/kaboom"
import { AudioPlay, GameObj, Vec2 } from "kaboom"
import { state, dmgPlayer } from "@/state"
import { initExtractable } from "@/kaboom/logic/map"
import Disaster from "@/kaboom/logic/disaster/disasterClass"

interface LavaState{
    cooldown: number;
    pos: Vec2[];
    time:number;
    isOnHighground:boolean[];
    sfx: AudioPlay
}

export default class Nuke extends Disaster<LavaState>{
    name = "Lava"
    description = "A HUGE lava eruption has been detected as imminent. Search for high rocks if you are unable to make it to shelter!"
    state = {
        pos:[...Array(5)].map(()=>k.vec2(k.rand(0,3000),k.rand(0,2000))),
        time:0,
        cooldown:0,
        opacity:0,
        isOnHighground:[] as boolean[],
        sfx:k.play("lava",{
            loop:true,
        })
    }

    init(){
        const lavaState = this.state
        lavaState.sfx.pause()
        k.add([
            k.stay(),
            {
                update() {
                    
                    lavaState.time += k.dt()
                    
                    if(!state.currentDiaster || state.scene === "death"){
                        lavaState.sfx.stop()
                        this.destroy()
                    }

                    //Manage cooldown
                    if(lavaState.cooldown > 0){
                        lavaState.cooldown = lavaState.cooldown - k.dt()
                    }

                    //After 5 seconds rise lava
                    if(lavaState.time > 5 && lavaState.opacity <= 1){
                        if(lavaState.sfx.paused()) lavaState.sfx.play()
                        k.shake(5)
                        lavaState.opacity += 0.01
                    }
                }
            } as any
        ])
    }

    planet(){
        const lavaState = this.state
        lavaState.sfx.volume(3)
        const player = k.get("player")[0]
        //Add high ground rocks
        lavaState.pos.forEach((pos,i)=>{
            k.add([
                ...initExtractable({
                    type: "rock",
                    health:30,
                    gives:"stone",
                    value:5
                },pos,"rock_2"),
                k.scale(4),
                k.area(),
                {
                    introOp:0,
                    add(){
                        //Allow player to stand on it
                        this.solid = false
                    },

                    update() {
                        if(!state.currentDiaster || state.scene === "death"){
                            if(k.chance(0.5)){
                                this.destroy()
                            }
                        }
                        if(this.introOp < 1){
                            this.introOp += 0.01
                            this.opacity = this.introOp
                        }

                        lavaState.isOnHighground[i] = this.isTouching(player)
                    }
                },
                "highground"
            ])
        })


        //Lava
        k.add([
            k.rect(5000,3000),
            k.color(248,58,12),
            k.opacity(0),
            k.area(),
            {
                
                update(){
                    if(!state.currentDiaster || state.scene === "death"){
                        this.destroy()
                    }
                    this.opacity = lavaState.opacity

                    //Safe!
                    if(lavaState.isOnHighground.some(e=>e === true)) return;

                    if(this.opacity >= 1 && this.isTouching(player) && lavaState.cooldown <= 0){
                        dmgPlayer(1)
                        lavaState.cooldown = 1
                    }
                }
            } as any
        ])
        
    }

    interior(){
        this.state.sfx.volume(1)
        this.canceler = k.loop(3,()=>{
            k.shake(2)
        })
    }

}

k.loadSound("lava", "audio/lava.webm")