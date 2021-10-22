import k from "@/kaboom"
import { setScene } from "@/state"
import { restoreDisaster } from "@/kaboom/logic/disaster"

const room = [
"<==============>",
"[--------------]",
"[--------------]",
"[--------------]",
"[--------------]",
"[--------------]",
"#.......2......^",
"        x       "


]


k.scene("shelter",()=>{
    const player = k.get("player")[0];
    player.moveTo(275,190)

    //Room
    k.addLevel(room, {
        width: 32,
        height: 32,

        "x": () => [
            k.pos(),
            k.area(),
            k.z(-1),
            k.sprite("interior", {
              frame: 57,
            }),
            {
                add(){
                    this.collides("player",()=>{
                        setScene("planet")
                    })
                }
            } as any
        ],

        "2": () => [
            k.z(-1),
            k.sprite("interior", {
              frame: 36,
            }),
        ],
        
        "^": () => [
          k.z(-1),
          k.sprite("interior", {
            frame: 35,
          }),
        ],
      
        "#": () => [
          k.z(-1),
          k.sprite("interior", {
            frame: 33,
          }),
        ],
      
        "]": () => [
          k.z(-1),
          k.sprite("interior", {
            frame: 21,
          }),
        ],
      
        "[": () => [
          k.z(-1),
          k.sprite("interior", {
            frame: 19,
          }),
        ],
      
        ".": () => [
          k.z(-1),
          k.sprite("interior", {
            frame: 34,
          }),
        ],
        "-": () => [
          k.z(-1),
          k.sprite("interior", {
            frame: 20,
          }),
        ],
        "<": () => [
          k.z(-1),
          k.sprite("interior", {
            frame: 5,
          }),
        ],
        "=": () => [
          k.z(-1),
          k.sprite("interior", {
            frame: 6,
          }),
        ],
        ">": () => [
          k.z(-1),
          k.sprite("interior", {
            frame: 7,
          }),
        ],
    } as any);

    //Coliders
    //Top
    k.add([
        k.rect(room[0].length * 32,2),
        k.pos(0,-2),
        k.area(),
        k.opacity(0),
        k.solid()
    ])
    //Bot
    k.add([
        k.rect(room[0].length * 32,2),
        k.pos(0,(room.length * 32) - 31),
        k.area(),
        k.opacity(0),
        k.solid()
    ])
    //Left
    k.add([
        k.rect(2,room.length * 32),
        k.pos(-2,0),
        k.area(),
        k.opacity(0),
        k.solid()
    ])
    //right
    k.add([
        k.rect(2,room.length * 32),
        k.pos((room[0].length * 32)+2,0),
        k.area(),
        k.opacity(0),
        k.solid()
    ])

    restoreDisaster()
      
})



k.loadSprite("interior","tiles/in.png",{
    sliceX:14,
    sliceY:6
})
