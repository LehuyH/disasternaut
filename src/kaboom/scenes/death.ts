import k from "@/kaboom"
import { state } from "@/state"

k.scene("death",()=>{
    const player = k.get("player")[0]
    if(!player) return

    k.add([
        k.color(0,0,0),
        k.rect(2000,2000),
        {
            scale:1,
            update() {
                this.scale += 0.001
                k.camScale(k.vec2(this.scale,this.scale))
            }
        } as any
    ])


    player.use(k.pos(1000,1000))
    //Hide Player
    player.use(k.opacity(0))
    player.tool.use(k.opacity(0))
    player.allowMovement = false

    //Add fake (dead) player
    k.add([
        k.sprite("player", { anim: "left" }),
        k.pos(1000,1000),
        k.origin("center"),
    ])

    k.play("death",{
        volume:2
    })

    //Music
    k.add([
        k.stay(),
        {
            audio:null,
            add(){
                k.wait(1,() => {
                    this.audio = k.play("piano",{
                        loop:true
                    })
                })        
            },
            update() {
                if(state.scene !== "death"){
                    this.audio && this.audio.stop()
                    this.destroy()
                }
            }
        } as any
    ])
})

k.loadSound("piano", "audio/piano.webm")