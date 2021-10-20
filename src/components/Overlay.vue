<template>
    <div class="overlay" v-if="modelValue" :style="`background: var(--${color});`">
        <h1>{{ title }}</h1>
        <p>{{ text }}</p>

        <br />

        <button :style="`--accent: var(--${color});`" @click="dismiss">Dismiss</button>
    </div>
</template>

<script setup lang="ts">
import { defineComponent, PropType, ref, watch } from "vue";

defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    color: {
        type: String,
        default: "blue",
    },
    title: {
        type: String,
    },
    text: {
        type: String,
    }
})

const emit = defineEmits(["update:modelValue"])

// const isShowing = ref(props.showing);

// watch(props.showing, () => {

// });

const dismiss = () => emit("update:modelValue", false);


</script>

<style scoped>
.overlay {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 3;
}

h1 {
    font-size: 4rem;
}

p {
    font-size: 1.5rem;
}

button {
    --border: white;
    font-size: 1.5rem;
}
</style>