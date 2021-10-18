import useKaboom from "../index"
import { Character } from "kaboom"
const k = useKaboom()

//Markup
export default () => [
    behavior()
]


//Logic
function behavior(){
    return{
        id:"unique"
    } as any as Character<unknown>
}


//Style

