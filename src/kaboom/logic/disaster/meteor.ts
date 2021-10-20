import k from "@/kaboom"
import { DisasterLogic } from "./index"
import { Character } from "kaboom"
import { addExtractable } from "@/kaboom/logic/map"
import { notify } from "@/state"

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
        k.rect(100, 10),
        k.scale(1),
        {
            id: "shadow",
            startingDist: null,
            add() {
                this.startingDist = meteor.pos.dist(this.pos)
            },
            update() {
                //Change size based on how close the meteor is to the shadow
                const dist = meteor.pos.dist(this.pos)
                const scale = Math.abs(1 - (Math.max(0, dist / this.startingDist)))
                this.scaleTo(scale)
                /*
                k.drawEllipse({
                    radiusX:50,
                    radiusY:20,
                    start:0, 
                    end:0,
                    fill:true,
                    opacity:0.5
                })*/
            }
        } as any
    ])



}



export default {
    name: "Meteors",
    description: "HUGE meteors are approaching the planet! Take cover!",
    start(duration: number) {
        const canceler = k.loop(0.35, () => {
            createMeteor()
        })
        k.wait(duration, () => {
            notify("end")
            canceler()
        })
    }
} as DisasterLogic

k.loadSound("meteor_impact", "audio/impact.webm")