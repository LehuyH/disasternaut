import { generator, initExtractable, scatterExtractable } from "@/kaboom/logic/map"
import buildPlayer from "../objects/player"
import k from "@/kaboom"



const level = generator.create({
    worldWidth:14,
    worldHeight:25,
    birthLimit:6,
    deathLimit:3,
    numberOfSteps:10,
    chanceToStartAlive:0.4
})
//Padding



k.scene("planet",()=>{
    k.add([
        k.sprite("ground",{
            tiled:true,
            width:2500,
            height:2000
        })
    ])

    //Add trees
    k.addLevel(level,{
        width:128,
        height:128,
        "1": ()=>{
            return initExtractable({
                type:"tree",
                value:1,
                gives:"wood",
                health:10
            })
        }
    }as any)

    //Add rocks
    scatterExtractable({
        type:"rock",
        gives:"stone",
        value:1,
        health:10
    },Math.round(k.rand(5,15)))

    k.add(
        [
            ...buildPlayer(),
            k.pos(1800,900)
        ]
    )
})

const loadVariants = (type:string,count:number,extension:string="png") => {
    [...Array(count)].forEach((x,i)=>{
        k.loadSprite(`${type}_${i+1}`,`sprites/${type}_${i+1}.${extension}`)
    })
}

k.loadSprite("ground","tiles/ground_large.png")
loadVariants("tree",2)
loadVariants("rock",4)
loadVariants("metal",4)


