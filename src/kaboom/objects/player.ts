import { Character, KaboomCtx } from "kaboom"
import k from "@/kaboom"
import createBuilding from "@/kaboom/objects/building"
import { state } from "@/state"
import { allowedToBuild } from "@/kaboom/logic/buildings"

//Markup
export default () => [
        "player",
        k.sprite("player",{ anim:"down"}),
        k.pos(0,0),
        k.health(5),
        k.area(),
        k.solid(),
        behavior(),
        k.origin("center")
]


//Logic
function behavior() {
    const playAnim = (player:any,name:string) =>{
        if(name != player.curAnim()){  
            player.play(name)
        }
    }  
    
    const movement = {
        'down': (p:Character<any>)=>{
            p.move(0,200)
        },
        'up': (p:Character<any>)=>{
            p.move(0,-200)
        },
        'left': (p:Character<any>)=>{
            p.move(-200,0)
            playAnim(p,"right")
        },
        'right': (p:Character<any>)=>{
            p.move(200,0)
            playAnim(p,"right")
        }
    } 
    
    return {
        id:"main_player",
        require: [ "area", "pos", "health"],
        allowMovement:true,
        facing:null,
        add() {
           //Create line that points in direction of mouse
           const player = this
           
           player.facing = k.add([
            {
                draw(){
                    const angle = player.pos.angle(k.mouseWorldPos())
                    k.drawRect(player.pos.add(0,15),-30,4,{
                        rot:angle
                    })
                }
            }
            ])
        },
        update(){
            const angle = this.pos.angle(k.mouseWorldPos())
            
            //Follow player
            k.camPos(this.pos);
            

            //Make player face mouse
            if(angle > -90 && angle < 90){
                this.flipX(true)
            }else{
                this.flipX(false)
            }
            
            //Building placement
            if(state.interaction.placingBuilding && k.mouseIsClicked()){
                const [allowed,msg] = allowedToBuild(state.interaction.placingBuilding)

                if(allowed){
                    k.add(createBuilding(state.interaction.placingBuilding,k.mouseWorldPos()))
                    state.interaction.placingBuilding = null;
                }else{
                    k.debug.log(msg as string)
                }


            }

            //Handle input
            if(!this.allowMovement) return 
            if(k.keyIsDown("d") || k.keyIsDown("right")) movement.right(this)
            else if(k.keyIsDown("a") || k.keyIsDown("left")) movement.left(this)
            else if(k.keyIsDown("w") || k.keyIsDown("up")) movement.up(this)
            else if(k.keyIsDown("s") || k.keyIsDown("down")) movement.down(this)
            
           
        },
        destroy(){
            this.facing.destroy()
        }
    } as any as Character<unknown>
}


k.loadSprite("player","sprites/player.png",{
    sliceX:3,
    sliceY:4,
    anims:{
        down:{
            from:0,
            to:2,
        },
        left:{
            from:3,
            to:5
        },
        right:{
            from:6,
            to:8
        },
        up:{
            from:9,
            to:11
        }
    }
})


