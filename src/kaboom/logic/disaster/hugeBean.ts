import k from "@/kaboom"
import { AudioPlay, GameObj, Vec2 } from "kaboom"
import { state, dmgPlayer } from "@/state"
import Disaster from "@/kaboom/logic/disaster/disasterClass"

interface BeanState {
    cooldown: number;
    pos: Vec2;
    time: number;
}

export default class Nuke extends Disaster<BeanState>{
    name = "Huge Bean"
    description = "A HUGE bean has been detected. Proceeed with caution."
    state = {
        pos: k.vec2(0, 0),
        target: k.vec2(0, 0),
        time: 0,
        cooldown: 0
    }

    init() {

        if (state.scene === "planet") {
            const player = k.get("player")[0];
            this.state.pos = k.vec2(k.rand(player.pos.x - 500, player.pos.x + 500) + 800, k.rand((player.pos.y - 500, player.pos.y + 500)+600))
        }

        const beanState = this.state
        k.add([
            k.stay(),
            {
                update() {

                    beanState.time += k.dt()

                    if (!state.currentDiaster || state.scene === "death") {
                        this.destroy()
                    }

                    //Manage cooldown
                    if (beanState.cooldown > 0) {
                        beanState.cooldown = beanState.cooldown - k.dt()
                    }


                }
            } as any
        ])
    }

    planet() {
        const beanState = this.state
        const mainBean = k.add([
            k.sprite("bean"),
            k.pos(beanState.pos),
            k.scale(5),
            k.area(),
            k.origin("center"),
            {
                add() {
                    this.collides("extractable", (e: GameObj<any>) => {
                        e.destroy()
                    })
                    this.collides("player", () => {
                        dmgPlayer(1)
                    })
                },
                update() {
                    const player = k.get("player")[0]

                    //Shoot
                    if (player.pos.dist(this.pos) < 500 && beanState.cooldown <= 0) {
                        beanState.cooldown = 1
                        shoot()
                    }

                    if (!state.currentDiaster || state.scene === "death") {
                        this.destroy()
                    }


                    this.moveTo(player.pos, 150)
                    beanState.pos = this.pos

                }
            } as any
        ])


        const shoot = () => {
            const player = k.get("player")[0]

            k.burp()
            k.shake(5)

            k.add([
                k.sprite("bean"),
                k.pos(beanState.pos),
                k.area(),
                k.scale(0.75),
                k.origin("center"),
                k.rotate(player.pos.angle(beanState.pos)),
                k.lifespan(1),
                k.move(player.pos.angle(beanState.pos), 900),
                {
                    add() {
                        this.collides("player", () => {
                            dmgPlayer(1)
                            this.destroy()
                        })
                        this.collides("extractable", (e: GameObj<any>) => {
                            e.destroy()
                            this.destroy()
                        })
                    }
                } as any
            ])
        }
    }

    interior() {
        this.canceler = k.loop(1, () => {
            if (k.chance(0.9)) {
                k.shake(2)
                k.burp({
                    volume: 0.1
                })
            }
        })
    }

}

k.loadBean()