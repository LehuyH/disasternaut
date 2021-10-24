import { Collision, GameObj, AudioPlay } from "kaboom"
import k from "@/kaboom"
import { state } from "@/state"
import { addBuilding } from "@/kaboom/logic/buildings"
import { getActiveTool, setScene } from "@/state"

//Markup
export default () => [
    "player",
    k.sprite("player"),
    k.pos(0, 0),
    k.health(5),
    k.area(),
    k.z(10),
    k.stay(),
    k.scale(0.75),
    k.solid(),
    behavior(),
    k.origin("center")
]


//Logic
function behavior() {
    const inputs = {} as Record<string,boolean>

    const dirt = k.play("steps")
    dirt.loop()
    dirt.pause()
    dirt.speed(2)

    const metal = k.play("steps_metal")
    metal.loop()
    metal.pause()
    metal.speed(1.5)

    const playAnim = (player: any, name: string) => {
        if (name != player.curAnim()) {
            player.play(name)
        }
    }

    const playSteps = () => {
        if (state.scene === "planet") {
            dirt.play()
            metal.stop()
        }
        else {
            metal.play()
            dirt.stop()
        }
    }

    const movement = {
        'down': (p: GameObj<any>) => {
            p.move(0, 200)
            playSteps()
        },
        'up': (p: GameObj<any>) => {
            p.move(0, -200)
            playSteps()
        },
        'left': (p: GameObj<any>) => {
            p.move(-200, 0)
            playAnim(p, "walk")
            playSteps()
        },
        'right': (p: GameObj<any>) => {
            p.move(200, 0)
            playAnim(p, "walk")
            playSteps()
        }
    }

    return {
        id: "main_player",
        require: ["area", "pos", "health"],
        allowMovement: true,
        facing: null,
        isExtracting: false,
        add() {
            const player = this
            //Handle building entering
            player.collides("shelter", (s: GameObj<any>, col: Collision) => {
                if (!col?.isTop()) return

                setScene("shelter")
            })

            //Render tool
            player.tool = k.add(
                [
                    "tool",
                    k.sprite("axe"),
                    k.pos(),
                    k.stay(),
                    k.z(10),
                    k.origin("center"),
                    k.area({ scale: 3 }),
                    k.follow(player, k.vec2(25, -10)),
                    {
                        update() {

                            const tool = getActiveTool()
                            //No active tool
                            if (!tool) {
                                player.isExtracting = false
                                this.opacity = 0
                                return;
                            }

                            //Set sprite to currently held tool
                            this.use(k.sprite(tool.spriteName))

                            const mouseIsDown = k.mouseIsDown()
                            const angle = player.pos.angle(k.mouseWorldPos())

                            //Flip so it faces correctly
                            const notFlipped = (angle > -90 && angle < 90)
                            this.flipY(!notFlipped)

                            if(notFlipped){
                                this.use(k.follow(player, k.vec2(-25, -10)))
                            }else{
                                this.use(k.follow(player, k.vec2(25, -10)))
                            }

                            //Run animations when mouse is down
                            if (mouseIsDown) {
                                this.angle += (notFlipped) ? -8 : 8
                            } else {
                                this.use(k.rotate(angle))
                            }

                            player.isExtracting = mouseIsDown

                        }
                    } as any
                ])
        },
        update() {
            const angle = this.pos.angle(k.mouseWorldPos())

            //Follow player
            k.camPos(this.pos);


            //Make player face mouse
            this.flipX((angle > -90 && angle < 90) ? false : true)

            //Building placement
            if (state.interaction.placingBuilding && k.mouseIsClicked()) {
                if (!state.interaction.placingBuilding) return
                addBuilding(state.interaction.placingBuilding, k.mouseWorldPos())
            }

            //Handle input
            if (!this.allowMovement || !k.focused()) return
            const keys = ["w","a","s","d","right","up","down","left"]

            keys.forEach(key => inputs[key] = k.keyIsDown(key as any))

            if (inputs["d"] || inputs["right"]) movement.right(this)
            if (inputs["a"] || inputs["left"]) movement.left(this)
            if (inputs["w"] || inputs["up"]) movement.up(this)
            if (inputs["s"] || inputs["down"]) movement.down(this)
            //No movement, stop steps
            if(Object.values(inputs).every(e=>e === false)) {
                metal.stop()
                dirt.stop()
            }


        },
        destroy() {
            this.tool.destroy()
        }
    } as any as GameObj<unknown>
}


k.loadSprite("player", "sprites/player.png", {
    sliceX:2,
    anims:{
        walk:{
            from:0,
            to:1,
            speed:5
        }
    }
})
k.loadSprite("axe", "sprites/axe.png")
k.loadSound("steps_metal", "audio/steps_metal.webm")
k.loadSound("steps", "audio/steps.webm")
k.loadSound("death", "audio/death.webm")
k.loadSound("hurt", "audio/hurt.webm")


