import k from "@/kaboom";
import { effect } from "vue";

const materialTypes = ["wood", "metal", "stone"];

export default function createQuota() {
    const quota: Record<string, number> = {};

    const days = Math.round(k.rand(3, 5));

    for (const type of materialTypes) {
        const targetAmount = Math.round(k.rand(9, 12)) * days;
        quota[type] = targetAmount
    }

    if (k.rand(0, 10) <= 1) {
        quota["uranium"] = k.randi(0, 4);
    }
    
    return quota;
}