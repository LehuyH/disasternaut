import k from "@/kaboom"
import { Character } from "kaboom"
import { getActiveTool, state } from "@/state"

export interface Extractable{
    type:string;
    health:number;
    gives:string;
    value:number
}

//Markup
export default (config:Extractable) => [
    behavior(config)
]


//Logic
function behavior(config:Extractable){
    let onCooldown = false
    return{
        id:"extractable",
        require:["area","pos","opacity"],
        extractableHealth:0,
        add(){
            this.extractableHealth = config.health
        },
        update(){
            const player = k.get("player")[0]
            if(!player) return
            if(!player.isExtracting) return

            if(this.isColliding(player.tool)){
                if(onCooldown) return
                const tool = getActiveTool()
                if(!tool) return


                if(tool.effective.includes(config.type)){
                    //Remove extra damage if effective
                    this.extractableHealth -= tool.power * 2
                }else{
                    this.extractableHealth -= tool.power * 0.5
                }

                //Fade away object as it gets extracted
                this.opacity = (this.extractableHealth/config.health)

                //Handle cooldown
                onCooldown = true
                k.wait(0.1,()=>{
                    onCooldown = false
                })

                if(this.extractableHealth <= 0){
                    //Give player item and destroy this object
                    const currentCount = state.persistent.resources[config.gives]
                    state.persistent.resources[config.gives] = (currentCount) ? currentCount + config.value : config.value
                    this.destroy()
                }
            }
        },
    } as any as Character<unknown>
}


//Style
