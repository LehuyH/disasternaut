import kaboom, { KaboomCtx } from "kaboom";

export default kaboom({
    width:1920,
    height:1080,
    crisp:true,
    global:false,
    stretch:true,
    canvas:document.querySelector('canvas') as HTMLCanvasElement,
    background:[32,31,53]
});