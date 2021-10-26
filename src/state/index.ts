import { getCurrentInstance, reactive, computed } from 'vue'
import k from "@/kaboom"
import Disaster from "@/kaboom/logic/disaster/disasterClass"
import { MapSave, exportMapState, respawnMap } from "@/kaboom/logic/map"
import createQuota from "@/kaboom/logic/quota"
import { startRandomDisaster } from "@/kaboom/logic/disaster"

export const wait = (s: number, callback: () => void) => setTimeout(() => callback(), s * 1000)

export interface Tool {
    name: string;
    spriteName: string;
    power: number;
    effective: string[]
}

export interface Objective {
    name: string;
    description: string;
}

export interface Entry {
    title: string;
    description: string;
    time: {
        day: number;
        hour: number;
    }
}

export const state = reactive({
    canvas: document.querySelector("canvas"),
    position: k.mouseWorldPos(),
    interaction: {
        placingBuilding: null as null | string,
        currentToolIndex: -1,
        showQuota: false,
        showLog: false,
        quotaSuccess: false,
        showLetter: false,
        nextToBed: false,
        debtLetterShown: false,
        tutorialButtonPulsing: {
            "shelter": false,
            "nuclear_generator": false,
            "communications": false,
            "oxygen_tank": false,
            "log": false
        } as Record<string, boolean>
    },
    persistent: {
        name: "",
        dayRespawned: 0,
        maxHealth: 5,
        health: 5,
        day: 0,
        hour: 12,
        numDisasters: 0,
        oxygen: 120,
        maxOxygen: 120,
        failures: 0,
        tools: [] as Tool[],
        quota: {} as Record<string, number>,
        quotaDay: null as number | null,
        requestMap: true as boolean,
        resources: {
        } as Record<string, number>,
        map: {
            extractables: [],
            buildings: [],
        } as MapSave,
        objectives: {
            survival: [] as Objective[],
            huge: [] as Objective[]
        } as Record<string, Objective[]>,
        log: [] as Entry[]
    },
    scene: "onboarding",
    currentDiaster: null as null | Disaster,
    disasterTimer: 0,
    notis: [] as string[],
    newGame: true as boolean,

})


//This acts as a game loop function that will run every second
let onTutorial = true
function gameLoop() {
    if (state.scene === "death") return;

    const player = k.get("player")[0]

    //Spend Oxygen if Player is in shelter
    if (state.scene === "shelter") {
        state.persistent.oxygen--

        if (state.persistent.oxygen <= 0) {
            //Reset
            dmgPlayer(1)
        }

        //Respawn map if day passed
        if (state.persistent.dayRespawned !== state.persistent.day) {
            respawnMap()
            state.persistent.dayRespawned = state.persistent.day

            //Add fun random fun news feed
            addToLog(k.choose(news.stories))
        }
    }

    //Game doesn't exist
    if (!player) return

    //Death!
    if (state.persistent.health <= 0) {
        state.persistent.health = 0
        setScene("death")
    }

    if (state.currentDiaster) {
        state.disasterTimer--
        //reset diaster if over
        if (state.disasterTimer <= 0) {
            state.currentDiaster.exit && state.currentDiaster.exit()
            state.currentDiaster.canceler && state.currentDiaster.canceler()
            state.currentDiaster = null
        }
    }

    k.setData("save", state.persistent)
    if (state.scene === "planet") exportMapState()


}


//This triggers the game loop function
k.add([
    k.stay(),
    {
        time: 0,
        nextHour: 0,
        //In game, 30 seconds = 1 hour
        secondsPerHour: 30,
        update() {
            this.time += k.dt()
            //Very second
            if (this.time >= 1) {
                gameLoop()
                this.time = 0
                this.nextHour++

                //Next hour
                if (this.nextHour >= this.secondsPerHour) {
                    state.persistent.hour++
                    this.nextHour = 0
                    const inDebt = (state.persistent.failures >= 3)
                    //Check quota if due or in debt
                    if ((state.persistent.quotaDay && state.persistent.quotaDay <= state.persistent.day) || inDebt) {
                        const passed = Object.entries(state.persistent.quota).every(([key, target]) => {
                            const current = state.persistent.resources[key] || 0

                            return target <= current
                        })

                        if (!passed && !inDebt) state.persistent.failures++
                        if (passed) {
                            //Reset failures
                            if (inDebt) {
                                state.persistent.failures = 0
                                state.interaction.debtLetterShown = false
                            }
                            else state.persistent.failures = Math.max(state.persistent.failures - 1, 0)

                            //Charge quota
                            Object.entries(state.persistent.quota).forEach(([key, target]) => {
                                state.persistent.resources[key] -= target
                            })

                            //Add to news feed
                            addToLog({
                                title:`${state.persistent.name}'s planet deemed "highly prosperous" after fulfilling quota!`,
                                description:`In what was described by members of the board as \"the fruits of an extensive application of their scientific abilities\", the board of HUGE revealed further results of production quotas on a colony they had recently set up, in what was heralded by many as a triumph.\n\According to the announcement, the quota was fulfilled after the application of their \"systematic and efficient approach to resource gathering\", as described by one member. The initial test suggested that this planet, dubbed \"${state.persistent.name}\'s Planet\", is \"highly prosperous, even in comparison to neighboring systems\" and is \"rapidly growing, expanding and prospering\".`
                            })
                        }else{
                            addToLog({
                                title:`${state.persistent.name}'s planet denounced by HUGE after missing quota!`,
                                description:`The board of HUGE described ${state.persistent.name}'s planet as \"less than desirable\". In light of this \"disappointing\" result, the board described themselves as being \"highly concerned\" about the future of the colony, warning that \"a failure to meet the quota is not something we can afford to take lightly, as you may recall.\"`
                            })
                        }

                        if (!state.interaction.debtLetterShown) {
                            if (inDebt) state.interaction.debtLetterShown = true
                            //Show letter and lock player
                            k.get("player")[0].allowMovement = false
                            state.interaction.quotaSuccess = passed
                            state.interaction.showLetter = true
                            setQuota()
                        }

                    }

                    //Select random disaster and start it
                    if (!state.currentDiaster && state.persistent.numDisasters === 1 && onTutorial) {
                        //Let new players get a longer first break before staring next disaster
                        onTutorial = false
                    }
                    else if (!state.currentDiaster && state.persistent.numDisasters > 0 && !state.interaction.showLetter) startRandomDisaster()


                    //Is next day?
                    if (state.persistent.hour === 25) {
                        state.persistent.hour = 0
                        state.persistent.day++
                    }
                }
            }
        }
    } as any
])

const updatePos = ({ offsetX, offsetY }: MouseEvent) => {
    state.position = k.mouseWorldPos();
};
state.canvas?.addEventListener("mousemove", updatePos);
state.canvas?.addEventListener("mouseover", updatePos);


export function setScene(scene: string) {
    //If leaving planet save map
    if (state.scene === "planet") exportMapState()

    k.go(scene)
    state.scene = scene

}

export function addTool(tool: Tool) {
    state.persistent.tools.push(tool)
}

export function getActiveTool(): Tool | null {
    const tool = state.persistent.tools[state.interaction.currentToolIndex]
    if (!tool) return null
    return tool
}

export function setTool(index: number): Tool | null {
    const tool = state.persistent.tools[index]
    if (!tool) return null

    state.interaction.currentToolIndex = index
    return tool
}

export function notify(text: string) {
    console.log(text);
    state.notis.push(text);
    setTimeout(() => state.notis.shift(), 3000);
}

export function addToLog({ title, description }: Omit<Entry, "time">) {
    state.persistent.log.unshift({
        title, 
        description,
        time: {
            day: state.persistent.day,
            hour: state.persistent.hour,
        }
    });
    
    state.interaction.tutorialButtonPulsing.log = true;
}

export function removeObjective(type: string, name: string) {
    if (!state.persistent.objectives[type]) return

    const objectives = state.persistent.objectives[type]
    const index = objectives.findIndex(o => o.name === name)
    if (index == -1) return

    objectives.splice(index, 1)
}

export const matImageMap: Record<string, string> = {
    wood: "tree_1",
    metal: "metal_1",
    stone: "rock_1",
    uranium: "uranium_1",
}
export function dmgPlayer(damage: number = 1) {
    state.persistent.health -= damage
    k.play("hurt", {
        volume: 3
    })
    k.shake(2)
}

const news = {
    stories:[{
        title:`HUGE CEO named "World's Most Influential Scientist".. again!`,
        description:`The world’s top thinkers, innovators and leaders in their fields are asked to be named “Most Influential” by Orb Media. The list is composed of people who have a profound impact on our society. This year the list was composed of more than 300 people from over 50 countries.\n\nThe results of the voting by the Orb Media selection committee show that P. J. Pogan has again proven his status as a leader of a generation. From his work in developing a new vision for the human experience in space, to his vision for a sustainable future in the face of climate change and resource depletion.\n\n“I am honored to be named as the most influential scientist once again. It demonstrates that my work in the future of space exploration is more relevant and effective than ever before. I am proud to lead HUGE and excited to see our vision continue to grow,” said Dr. Pogan. “We have made significant progress in the last couple of years on a wide range of our research and development goals. Space is a frontier that we can now draw more attention and action to.`
    },{
        title:`HUGE breaks records yet again with addition of a new colony that's "bigger, faster, and better"!`,
        description:`With this exciting development, the board has gone ahead with the addition of yet another colony. The board has stated that the size of the colony is the new largest ever, and is even bigger than those of its previous colony additions.\n\n "This colony is now one of the best in the entire system and we have no doubt it will remain so in the future as well. With the addition of it's first species, there is no doubt that Huge will be known as the "best colony in the galaxy" for years to come. I congratulate all those involved in the development and the establishment of this amazing colony."`
    },{
        title:`HUGE discovers more new planets of great potential.`,
        description:`The board of Huge disclosed the another discovery of a planet with "amazing potential". "After much careful exploration of this planet, we have found much to recommend it. There is much to be explored and harvested, as well as a great number of suitable habitats and environments. This planet will be made available via our grant system for those who wish to explore it.`
    },{
        title:`Once again, HUGE has exceeded expectations!`,
        description:`It was announced that the HUGE has discovered additional habitable planets. According to one of the board of Huge, "We've found something that completely blew us away. The planet in question is almost perfect, so we have decided to offer it up as a grant. The new discovery is one of the most promising planets that we have seen yet, so we expect that this planet will make a great addition to the huge population of HUGE colonies."`
    },{
        title:`HUGE is on a roll!`,
        description:`Huge is growing, and the board of Huge has approved more grants! The board of Huge has approved a number of grants for colonies which have exceeded the expectations of the board in any number of ways. It was disclosed that one of these new grants was for an exploratory colony to find a new galaxy. The board of Huge is hoping that one of these grants will become a "huge" hit and could have a positive influence on the future of mankind.`
    },
    {
        title:`HUGE further expands grant offers!`,
        description:`Huge is looking to expand its grant program, with many more grants in the offing. This time, it is a new offer for any colonies that are looking to explore the skies, but also looking for land. As one of the board of Huge put it, "Our main focus is on the exploratory grants, as they are the main reason that we exist. However, if there are any other colonies that would be looking to expand with a grant, we would definitely be interested.`
    }]
}

export function setQuota() {
    //Player is in debt
    if (state.persistent.failures >= 3) {
        state.persistent.quota = {
            wood: 100,
            metal: 50,
            stone: 40
        }
        state.persistent.quotaDay = Infinity
        notify("Your are in Debt to HUGE. Check your quota for details.")
        return;
    }

    const [quota, days] = createQuota()
    state.persistent.quota = quota as Record<string, number>
    state.persistent.quotaDay = state.persistent.day + (days as number)
    notify("HUGE has sent you a new Quota. You have " + days + " days")
}