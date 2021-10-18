import { KaboomCtx } from "kaboom";

export const instance = {
    k: null as unknown as KaboomCtx,
}

export default ()=>{
    return instance.k
}