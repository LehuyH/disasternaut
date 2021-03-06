import kaboom from "kaboom";
import { setScene, addTool, setTool } from "@/state"

const k = kaboom({
    width: window.innerWidth,
    height: window.innerHeight,
    crisp: true,
    global: false,
    stretch: true,
    debug:false,
    canvas: document.querySelector('canvas') as HTMLCanvasElement,
    background: [32, 31, 53]
});

k.ready(() => {
    k.focus()
    setScene("onboarding")

    //Add an Axe
    addTool({
        name: "Axe",
        spriteName: "axe",
        power: 1,
        effective: ["tree"]
    })
    setTool(0)
})

export default k;