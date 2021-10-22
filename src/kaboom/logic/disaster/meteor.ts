import k from "@/kaboom"
import { DisasterLogic } from "./index"
import { addExtractable } from "@/kaboom/logic/map"
import { notify, state } from "@/state"
import { exit } from "process"


function createMeteor() {
    const player = k.get('player')[0]
    if (!player) return
    const atPlayer = k.chance(0.3)
    const startingX = (atPlayer) ? player.pos.x : k.rand(player.pos.x - 300, player.pos.x + 300)
    const endingY = (atPlayer) ? player.pos.y : k.rand(player.pos.y - 300, player.pos.y + 300)

    const meteor = k.add([
        k.sprite("metal_2"),
        k.origin("center"),
        k.area(),
        //Random position
        k.pos(startingX, -100),
        {
            update() {
                this.pos = this.pos.add(0, 5)
                if (this.pos.y >= endingY) {
                    k.shake(5)
                    k.play("meteor_impact")
                    shadow?.destroy()
                    //Add metal where it fell 25% chance
                    if (k.chance(0.25)) {
                        addExtractable({
                            health: 20,
                            gives: "metal",
                            type: "metal",
                            value: 2
                        }, this.pos, "metal_2")
                    }

                    this.destroy()
                }
            }
        } as any



    ])

    const shadow = k.add([
        k.pos(startingX, endingY),
        k.origin("center"),
        k.color(0, 0, 0),
        k.opacity(0.5),
        k.scale(1),
        {
            id: "shadow",
            startingDist: null,
            add() {
                this.startingDist = meteor.pos.dist(this.pos)
            },
            draw() {
                const dist = meteor.pos.dist(this.pos)
                const scale = Math.abs(1 - (Math.max(0, dist / this.startingDist)))
                k.drawEllipse({
                    pos:this.pos,
                    radiusX:40* scale,
                    radiusY:10 * scale,
                    start:0, 
                    end:0,
                    fill:true,
                    color:k.color(0,0,0).color,
                    opacity:scale-0.2
                })
            }
        } as any
    ])



}

function createIndoors() {
    k.wait(k.rand(0, 1), () => {
        k.shake(2)
        const m = k.play("meteor_impact")
        m.volume(0.25)

        if (k.chance(0.25)) {
            addExtractable({
                health: 20,
                gives: "metal",
                type: "metal",
                value: 2
            }, k.vec2(k.rand(100, 2400), k.rand(100, 1900)), "metal_2")
        }
    })

}



export default {
    name: "Meteors",
    description: "HUGE meteors are approaching the planet! Take cover!",
    canceler:null,
    planet(){
        this.canceler = k.loop(0.35, function(){
            if(state.disasterTimer > 0) createMeteor()
        })
    },
    interior(){
        this.canceler = k.loop(0.35, function(){
            if(state.disasterTimer > 0) createIndoors()
        })
    },
    exit(){
        //If tutorial then add next task
        if(state.persistent.numDisasters === 1){
            state.persistent.objectives.survival.push({
                name:"Connect to the HUGE Network",
                description:"To finish the processing of creating your colony, build a communications tower and connect to HUGE!"
            })
        }
    }
} as DisasterLogic

k.loadSound("meteor_impact", "audio/impact.webm")