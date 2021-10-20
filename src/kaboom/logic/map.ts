interface MapGenConfig{
    chanceToStartAlive?: number
    deathLimit?: number
    birthLimit?: number
    numberOfSteps?: number
    worldWidth?: number
    worldHeight?: number
    [index: string]:any
}

const Generator = {
    chanceToStartAlive: 0.4,
    deathLimit: 3,
    birthLimit: 4,
    numberOfSteps: 2,
    worldWidth: 64,
    worldHeight: 48,

    generateMap: function(config:MapGenConfig) {
        
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

export default Generator