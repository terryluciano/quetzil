<script setup lang="ts">
import { ref } from "vue";
import homeBanner from "../assets/home-banner.png";

const state = ref("");

const inputChange = (inputRef, e) => {
    // console.log(e);
    inputRef = e.target.value;
};
</script>

<template>
    <div class="w-full h-auto flex-center flex-col gap-12">
        <div
            class="w-full h-[512px] flex-center"
            :style="{
                backgroundImage: `url(${homeBanner})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
            }"
        >
            <h1
                class="font-Fira-Sans font-medium text-[64px] text-bg"
                :style="{
                    textShadow: '-4px 4px 4px #39332D',
                }"
            >
                <span class="text-primary">Want</span> it.
                <span class="text-primary">Find</span> it.
                <span class="text-primary">Eat</span> it.
            </h1>
        </div>
        <div class="flex-center flex-col gap-6 h-auto w-[400px]">
            <p class="text-xl font-semibold">What are you Craving?</p>
            <div class="gap-2 flex-center flex-col w-full">
                <div
                    class="flex flex-row justify-center items-center w-full gap-2"
                >
                    <input
                        class="border-b-[1px] border-b-solid border-b-text"
                        :value="state"
                        :oninput="(e) => inputChange(state, e)"
                    />
                    <input
                        class="border-b-[1px] border-b-solid border-b-text"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
