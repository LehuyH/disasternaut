import k from "@/kaboom"
import { Vec2 } from "kaboom"
import { state, dmgPlayer } from "@/state"
import Disaster from "@/kaboom/logic/disaster/disasterClass"

interface TsunamiState {
    scaleX: number;
    opacity: number;
    timeIdle: number;
    isOnHighground: boolean[];
    pos: Vec2[];
}

export default class Tsunami extends Disaster<TsunamiState>{
    name = "Tsunami"
    description = "A HUGE Tsunami has been detected. If you are unable to make it to the shelter / high ground, the safest calculated spot to be at is your far right."
    state = {
        scaleX: 0,
        opacity: 1,
        timeIdle: 0,
        cooldown: false,
        pos: [...Array(5)].map(() => k.vec2(k.rand(0, 3000), k.rand(0, 2000))),
        isOnHighground: [] as boolean[],
    }

    init() {

        const sfx = k.play("tsunami", {
            loop: true,
            volume: 0.75
        })

        const tsunamiState = this.state
        k.add([
            k.stay(),
            {
                update() {
                    //Move the Tsunami
                    if (tsunamiState.scaleX < 1) {
                        tsunamiState.scaleX += 0.2 * k.dt();
                        k.shake(0.5)
                    } else {
                        //Idle for 5 seconds, then fade away
                        if (tsunamiState.opacity <= 0 || state.scene === "death") {
                            sfx.stop();
                            this.destroy();
                            return;
                        };

                        if (state.disasterTimer <= 0 && tsunamiState.opacity > 0) {
                            tsunamiState.opacity -= 0.02
                        }
                    }

                }
            } as any
        ])
    }

    planet() {
        const tsunamiState = this.state
        const player = k.get("player")[0]
        //Add high ground rocks
        tsunamiState.pos.forEach((pos, i) => {
            k.add([
                k.pos(pos),
                k.sprite("rock_2"),
                k.scale(4),
                k.z(1),
                k.area(),
                {
                    introOp: 0,
                    add() {
                        //Allow player to stand on it
                        this.solid = false
                    },

                    update() {
                        if (!state.currentDiaster || state.scene === "death") {
                             //Fade out
                             if (this.opacity > 0) this.opacity -= 1.5 * k.dt()
                             else this.destroy()
                             return;
                        }
                        if (this.introOp < 1) {
                            this.introOp += 0.01
                            this.opacity = this.introOp
                        }

                        tsunamiState.isOnHighground[i] = this.isTouching(player)
                    }
                } as any,
                "highground"
            ])
        })

        //Add water
        k.add([
            k.rect(2500, 2000),
            k.color(38, 107, 126),
            k.pos(),
            k.area(),
            {
                update() {
                    this.use(k.scale(tsunamiState.scaleX, 1))
                    this.use(k.opacity(tsunamiState.opacity))
                    if (tsunamiState.opacity <= 0) {
                        this.destroy()
                    }

                    //Safe!
                    if (tsunamiState.isOnHighground.some(e => e === true)) return;

                    if (this.isTouching(k.get("player")[0]) && !tsunamiState.cooldown) {
                        dmgPlayer(1)
                        tsunamiState.cooldown = true
                        k.wait(2, () => {
                            tsunamiState.cooldown = false
                        })
                    }
                }
            } as any
        ])

    }

    interior() {
        this.state.cooldown = false
    }

}


k.loadSound("tsunami", "audio/tsunami.webm")