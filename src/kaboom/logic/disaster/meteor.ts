import k from "@/kaboom"
import { DisasterLogic } from "./index"
import { Character } from "kaboom"


function createMeteor(){
    const player = k.get('player')[0]
    if(!player) return
    const atPlayer = k.chance(0.7)
    const startingX = (atPlayer) ? player.pos.x : k.rand(player.pos.x-500,player.pos.x+500)
    const endingY = (atPlayer) ? player.pos.y: k.rand(player.pos.y-500,player.pos.y+500)
    const shadow = k.add([
        k.pos(startingX,endingY),
        k.origin("center"),
        k.color(0,0,0),
        k.opacity(0.5),
        k.rect(50,10)
         /*
        {
            id:"shadow",
            update(){
                k
                k.drawEllipse({
                    radiusX:50,
                    radiusY:20,
                    start:0, 
                    end:0,
                    fill:true,
                    opacity:0.5
                })
            }
        }*/
    ])
    k.add([
        k.rect(50,50),
        k.origin("center"),
        k.area(),
        //Random position
        k.pos(startingX,-100),
        {
                update() {
                    this.pos = this.pos.add(0, 5)
                    if (this.pos.y >= endingY) {
                        k.shake(10)
                        k.play("meteor_impact")
                        shadow.destroy()
                        this.destroy()
                    }
                }
        } as any

        

    ])
    


}



export default{
    name:"Meteors",
    description:"HUGE meteors are approaching the planet! Take cover!",
    start(duration:number){
        const canceler = k.loop(0.35,()=>{
            createMeteor()
        })
        k.wait(duration,()=>{
            k.debug.log("end")
            canceler()
        })
    }
} as DisasterLogic

k.loadSound("meteor_impact","audio/impact.webm")