<script setup lang="ts">
import { RouterLink } from "vue-router";
import largeLogo from "../assets/large-logo.svg";

const links: { text: string; link: string }[] = [
    {
        text: "Search",
        link: "search",
    },
    {
        text: "Add a Rating",
        link: "add-rating",
    },
];
</script>

<template>
    <nav
        class="w-full h-[104px] grid grid-cols-3 justify-center items-center align-middle place-content-center px-8 font-Fira-Sans font-medium text-xl"
    >
        <RouterLink to="/">
            <img
                :src="largeLogo"
                class="h-12 transition-all ease-in-out hover:drop-shadow-lg hover:scale-105 active:scale-100"
            />
        </RouterLink>
        <div class="w-full flex-center flex-row gap-6 self-center">
            <RouterLink
                v-for="link in links"
                :to="link.link"
                class="transition-all ease-in-out hover:text-primary active:text-primary active:scale-95"
                >{{ link.text }}</RouterLink
            >
        </div>
        <div class="flex flex-row justify-end self-center">
            <RouterLink
                to="login"
                class="flex-center rounded-xl px-3 h-10 transition-all ease-in-out bg-text hover:bg-text-hover text-bg active:bg-text-hover active:scale-95 cursor-pointer"
            >
                Login
            </RouterLink>
        </div>
    </nav>
</template>
