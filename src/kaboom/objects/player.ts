import { GameObj, KaboomCtx } from "kaboom"
import k from "@/kaboom"
import createBuilding from "@/kaboom/objects/building"
import { notify, state } from "@/state"
import { allowedToBuild } from "@/kaboom/logic/buildings"
import { getActiveTool } from "@/state"

//Markup
export default () => [
    "player",
    k.sprite("player", { anim: "down" }),
    k.pos(0, 0),
    k.health(5),
    k.area(),
    k.solid(),
    behavior(),
    k.origin("center")
]


//Logic
function behavior() {
    const playAnim = (player: any, name: string) => {
        if (name != player.curAnim()) {
            player.play(name)
        }
    }

    const movement = {
        'down': (p: GameObj<any>) => {
            p.move(0, 200)
        },
        'up': (p: GameObj<any>) => {
            p.move(0, -200)
        },
        'left': (p: GameObj<any>) => {
            p.move(-200, 0)
            playAnim(p, "left")
        },
        'right': (p: GameObj<any>) => {
            p.move(200, 0)
            playAnim(p, "left")
        }
    }

    return {
        id: "main_player",
        require: ["area", "pos", "health"],
        allowMovement: true,
        facing: null,
        isExtracting: false,
        add() {
            //Create line that points in direction of mouse
            const player = this

            player.tool = k.add(
                [
                    "tool",
                    k.sprite("axe"),
                    k.pos(),
                    k.origin("center"),
                    k.area({ scale: 3 }),
                    k.follow(player, k.vec2(0, 15)),
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
                const [allowed, msg] = allowedToBuild(state.interaction.placingBuilding)

                if (allowed) {
                    k.add(createBuilding(state.interaction.placingBuilding, k.mouseWorldPos()))
                    state.interaction.placingBuilding = null;
                } else {
                    notify(msg as string)
                }


            }

            //Handle input
            if (!this.allowMovement) return
            if (k.keyIsDown("d") || k.keyIsDown("right")) movement.right(this)
            else if (k.keyIsDown("a") || k.keyIsDown("left")) movement.left(this)
            else if (k.keyIsDown("w") || k.keyIsDown("up")) movement.up(this)
            else if (k.keyIsDown("s") || k.keyIsDown("down")) movement.down(this)


        },
        destroy() {
            this.tool.destroy()
        }
    } as any as GameObj<unknown>
}


k.loadSprite("player", "sprites/player.png", {
    sliceX: 3,
    sliceY: 4,
    anims: {
        down: {
            from: 0,
            to: 2,
        },
        left: {
            from: 3,
            to: 5
        },
        right: {
            from: 6,
            to: 8
        },
        up: {
            from: 9,
            to: 11
        }
    }
})
k.loadSprite("axe", "sprites/axe.png")


