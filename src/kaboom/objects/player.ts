import { Character, KaboomCtx } from "kaboom"
import k from "@/kaboom"


//Markup
export default () => [
        "player",
        k.sprite("player",{ anim:"down"}),
        k.pos(0,0),
        k.health(5),
        k.area(),
        behavior()
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
            playAnim(p,"down")
        },
        'up': (p:Character<any>)=>{
            p.move(0,-200)
            playAnim(p,"up")
        },
        'left': (p:Character<any>)=>{
            p.move(-200,0)
            playAnim(p,"left")
        },
        'right': (p:Character<any>)=>{
            p.move(200,0)
            playAnim(p,"right")
        }
    } 
    
    return {
        id:"main_player",
        require: [ "area", "pos", "health"],
        allowInput:true,
        add() {
           
        },
        update(){
            //Follow player
            k.camPos(this.pos);

            //Handle input
            if(!this.allowInput) return 
            if(k.keyIsDown("d") || k.keyIsDown("right")) movement.right(this)
            if(k.keyIsDown("a") || k.keyIsDown("left")) movement.left(this)
            if(k.keyIsDown("w") || k.keyIsDown("up")) movement.up(this)
            if(k.keyIsDown("s") || k.keyIsDown("down")) movement.down(this)
            
           
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


