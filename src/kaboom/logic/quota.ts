import k from "@/kaboom";
import { effect } from "vue";

const materialTypes = {
    wood:{
        base:12
    },
    stone:{
        base:5
    },
    metal:{
        base:7
    }
};

export default function createQuota() {
    const quota: Record<string, number> = {};

    const days = Math.round(k.rand(3, 5));

    Object.entries(materialTypes).forEach(([rss,config])=>{
        quota[rss] = k.randi(config.base,config.base + 3) * days;
    })
    
    return [quota,days];
}