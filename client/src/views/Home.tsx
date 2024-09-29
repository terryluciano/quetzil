import homeBanner from "../assets/home-banner.png";

const Home = () => {
    return (
        <div className="w-full h-auto flex-center flex-col gap-12">
            <div
                className="w-full h-[512px] flex-center"
                style={{
                    backgroundImage: `url(${homeBanner})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                }}
            >
                <h1
                    className="font-Fira-Sans font-medium text-[64px] text-bg"
                    style={{
                        textShadow: "-4px 4px 4px #39332D",
                    }}
                >
                    <span className="text-primary">Want</span> it.
                    <span className="text-primary">Find</span> it.
                    <span className="text-primary">Eat</span> it.
                </h1>
            </div>
            <div className="flex-center flex-col gap-6 h-auto w-[400px]">
                <p className="text-xl font-semibold">What are you Craving?</p>
                <div className="gap-2 flex-center flex-col w-full">
                    <div className="flex flex-row justify-center items-center w-full gap-2"></div>
                </div>
            </div>
        </div>
    );
};

export default Home;

/*
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
    <div className="w-full h-auto flex-center flex-col gap-12">
        <div
            className="w-full h-[512px] flex-center"
            style="{
                backgroundImage: `url(${homeBanner})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
            }"
        >
            <h1
                className="font-Fira-Sans font-medium text-[64px] text-bg"
                style="{
                    textShadow: '-4px 4px 4px #39332D',
                }"
            >
                <span className="text-primary">Want</span> it.
                <span className="text-primary">Find</span> it.
                <span className="text-primary">Eat</span> it.
            </h1>
        </div>
        <div className="flex-center flex-col gap-6 h-auto w-[400px]">
            <p className="text-xl font-semibold">What are you Craving?</p>
            <div className="gap-2 flex-center flex-col w-full">
                <div
                    className="flex flex-row justify-center items-center w-full gap-2"
                >
                    <input
                        className="border-b-[1px] border-b-solid border-b-text"
                        :value="state"
                        :oninput="(e) => inputChange(state, e)"
                    />
                    <input
                        className="border-b-[1px] border-b-solid border-b-text"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

 */
