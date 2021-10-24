import k from "@/kaboom"
import { AudioPlay, Vec2 } from "kaboom"
import { state, dmgPlayer } from "@/state"
import { addExtractable } from "@/kaboom/logic/map"
import Disaster from "@/kaboom/logic/disaster/disasterClass"

interface NukeState {
    scale: number,
    cooldown: boolean,
    radius: number,
    location: Vec2,
    sfx: AudioPlay,
    opacity: number
}

function inCircle(playerPos: Vec2, circlePos: Vec2, radius: number) {
    const dist = (playerPos.x - circlePos.x) * (playerPos.x - circlePos.x) + (playerPos.y - circlePos.y) * (playerPos.y - circlePos.y);
    radius *= radius;

    if (dist < radius) return true;

    return false;
}

export default class Nuke extends Disaster<NukeState>{
    name = "Nuke"
    description = "A HUGE explosion resembling a nuclear explosion has been detected. STAY AWAY from the calculated blast zone."
    state = {
        scale: 0,
        cooldown: false,
        time: 0,
        radius: k.rand(1000, 1600),
        sfx: k.play("nuke"),
        location: k.vec2(k.rand(100, 2100), k.rand(100, 1800)),
        opacity: 0.5,
    }

    init() {

        if (state.scene === "planet") {
            const player = k.get("player")[0];
            this.state.location = k.vec2(k.rand(player.pos.x - 1000, player.pos.x + 1000), k.rand(player.pos.y - 1000, player.pos.y + 1000))
        }

        this.state.sfx.pause()

        const nukeState = this.state
        k.add([
            k.stay(),
            {
                update() {
                    nukeState.time += k.dt()

                    if (!state.currentDiaster || state.scene === "death") {
                        if (nukeState.opacity > 0) nukeState.opacity -= 0.5 * k.dt()
                        else{
                            this.destroy()
                            nukeState.sfx.stop()
                        }
                    }


                    //After 5 seconds, detonate
                    if (nukeState.time >= 5 && nukeState.scale < 1) {
                        nukeState.scale += 0.05 * (40 * k.dt())
                        k.shake((state.scene === 'planet') ? 10 : 5)
                        nukeState.sfx.play()
                    }

                }
            } as any
        ])
    }

    planet() {
        this.state.sfx.volume(1.2)
        const nukeState = this.state

        //Blast
        k.add([
            k.origin('center'),
            k.pos(nukeState.location),
            {
                update() {
                    const player = k.get("player")[0]
                    const touching = inCircle(player.pos, nukeState.location, nukeState.radius * nukeState.scale)

                    if (touching && !nukeState.cooldown) {
                        nukeState.cooldown = true
                        dmgPlayer(1)
                        k.wait(1, () => {
                            nukeState.cooldown = false
                        })
                    }

                    if ((!state.currentDiaster || state.scene === "death") && nukeState.opacity <= 0) {
                        this.destroy()
                    }
                },
                draw() {
                    //Warning zone
                    k.drawCircle({
                        pos: nukeState.location,
                        radius: nukeState.radius,
                        color: k.color(210, 4, 45).color,
                        opacity: nukeState.opacity
                    })
                    //Real blast
                    k.drawCircle({
                        pos: nukeState.location,
                        radius: nukeState.radius,
                        color: k.color(246, 240, 82).color,
                        scale: nukeState.scale,
                        opacity: nukeState.opacity
                    })
                }
            } as any
        ])

    }

    interior() {
        this.state.sfx.volume(0.2)
    }

    exit(){
        addExtractable({
            type:"uranium",
            gives:"uranium",
            value:1,
            health:10
        },this.state.location.add(500,250),"uranium_1")
    }

}


k.loadSound("nuke", "audio/nuke.webm")