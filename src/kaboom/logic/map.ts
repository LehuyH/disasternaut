import k from "@/kaboom"
import extractable, { Extractable } from "@/kaboom/objects/extractable"
import { addBuilding } from "@/kaboom/logic/buildings"
import { GameObj, Vec2 } from "kaboom";
import { state, notify } from "@/state"

interface MapGenConfig{
    chanceToStartAlive?: number
    deathLimit?: number
    birthLimit?: number
    numberOfSteps?: number
    worldWidth?: number
    worldHeight?: number
    [index: string]:any
}

export const generator = {
    chanceToStartAlive: 0.4,
    deathLimit: 3,
    birthLimit: 4,
    numberOfSteps: 2,
    worldWidth: 64,
    worldHeight: 48,

    create: function(config:MapGenConfig) {
        
        //Update config
        for(const key in config) {
            (this as any)[key] = config[key];
        }
        
        let map:number[][] = [[]];
        this.initialiseMap(map);

        for(let i = 0; i < this.numberOfSteps; i++) {
            map = this.step(map);
        }

        const levelFormat = map.map(tiles=>` ${tiles.join('')} `)
        //Padding
        levelFormat.unshift(" ")
        levelFormat.push(" ")
        

        return levelFormat;
    },

    initialiseMap: function(map:number[][]) {
        for(let x = 0;  x < this.worldWidth; x++) {
            map[x] = [];
            for(let y = 0; y < this.worldHeight; y++) {
                map[x][y] = 0;
            }
        }

        for(let x = 0; x < this.worldWidth; x++) {
            for(let y = 0; y < this.worldHeight; y++) {
                if(Math.random() < this.chanceToStartAlive) {
                    map[x][y] = 1;
                }
            }
        }

        return map;
    },

    step: function(map:number[][]) {
        const newMap:number[][] = [[]];
        for(let x = 0; x < map.length; x++) {
            newMap[x] = [];
            for(let y = 0; y < map[0].length; y++) {
                let nbs = this.countAliveNeighbours(map, x, y);
                if(map[x][y] > 0) {
                    // check if should die
                    if(nbs < this.deathLimit) {
                        newMap[x][y] = 0;
                    } else {
                        newMap[x][y] = 1;
                    }
                } else {
                    // tile currently empty
                    if(nbs > this.birthLimit) {
                        newMap[x][y] = 1;
                    } else {
                        newMap[x][y] = 0;
                    }
                }
            }
        }

        return newMap;
    },

    countAliveNeighbours: function(map:number[][], x:number, y:number) {
        let count = 0;
        for(let i = -1; i < 2; i++) {
            for(let j = -1; j < 2; j++) {
                let nb_x = i + x;
                let nb_y = j + y;
                if(i === 0 && j === 0) {
                    // pass
                } else if(nb_x < 0 || nb_y < 0 || nb_x >= map.length || nb_y >= map[0].length) {
                    // if at the edge, consider it a solid
                    count = count + 1;
                } else if(map[nb_x][nb_y] === 1) {
                    count = count + 1;
                }
            }
        }

        return count;
    }
}

export function generateMap(){
    const level = generator.create({
        worldWidth:14,
        worldHeight:25,
        birthLimit:6,
        deathLimit:3,
        numberOfSteps:10,
        chanceToStartAlive:0.4
    })
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

    //Add metal
    scatterExtractable({
        type:"metal",
        gives:"metal",
        value:1,
        health:15
    },Math.round(k.rand(5,8)))
}

/** Returns the component list of an extractable */
export function initExtractable(config:Extractable,pos?: Vec2,spriteName?: string){
    const name = (spriteName) ? spriteName : getRandSpriteName(config.type)
    return [
        k.sprite(name),
        k.solid(),
        k.pos(),
        k.origin("center"),
        k.area({ scale:0.3}),
        k.z(1),
        k.opacity(1),
        "collideable",
        "extractable",
        ...extractable(config),
        {   
            spriteName:name,
            add(){
                if(pos) this.use(k.pos(pos))
            }
        } as any

    ]
}

/** Adds an extractable into the game */
export function addExtractable(config:Extractable,pos:Vec2,spriteName?:string){
    if(state.scene != "planet"){
        state.persistent.map.extractables.push({
            config,
            pos,
            spriteName: (spriteName) ? spriteName : getRandSpriteName(config.type)
        })
        return
    };
    k.add(initExtractable(config,pos,spriteName))
}

/** Randomally adds a number of extractables into the game */
export function scatterExtractable(config:Extractable,amount:number){
    [...Array(amount)].forEach(()=>{
        //Randomally select position and add it to the game
        const pos = k.vec2(k.rand(128,2300),k.rand(128,1200))
        addExtractable(config,pos)
    })
}

interface XY{
    x:number;
    y:number;
}

export interface ExtractableSave {
    config:Extractable,
    spriteName:string,
    pos:XY
}

export interface BuildingSave {
    name:string,
    pos:XY
}

export type MapSave = {
    extractables:ExtractableSave[],
    buildings:BuildingSave[],
}


export function restoreMap(map?:MapSave){
    if(!map) map = state.persistent.map
    

    map.extractables.forEach(exe=>{
        addExtractable(
            exe.config,
            k.vec2(exe.pos.x,exe.pos.y),
            exe.spriteName
        )
    })
    map.buildings.forEach(exe=>{
        addBuilding(exe.name,k.vec2(exe.pos.x,exe.pos.y),true)
    })

    
  
}

export function respawnMap(){
    state.persistent.requestMap = true;
    state.persistent.map.extractables = [];
    notify("The planet's terrain has grown back!")
}

export function exportMapState(){
    const extractables = [] as ExtractableSave[]
    const buildings = [] as BuildingSave[]

    k.every("extractable",(exe)=>{
        extractables.push({
            config:exe.config,
            spriteName:exe.spriteName,
            pos:{
                x:exe.pos.x,
                y:exe.pos.y
            }
        })
    })

    k.every("building",(building)=>{
        buildings.push({
            name:building.buildingName,
            pos:{
                x:building.pos.x,
                y:building.pos.y
            }
        })
    })

    const save = {
        extractables,
        buildings
    }

    state.persistent.map = save

    return save
}


function getRandSpriteName(type:string){
    const variants = {
        tree:2,
        rock:4,
        metal:4,
    } as Record<string,number>;

    const end = variants[type]
    
    return (end) ? `${type}_${Math.floor(Math.random() * (end - 1 + 1) + 1)}` : type
}