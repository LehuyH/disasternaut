import { Character, KaboomCtx } from "kaboom"


//Markup
export default (k:KaboomCtx) => [
        "player",
        k.sprite("player",{ anim:"down"}),
        k.pos(0,0),
        k.health(5),
        k.area(),
        behavior(k)
]


//Logic
function behavior(k:KaboomCtx) {
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



