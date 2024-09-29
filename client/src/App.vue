<script setup lang="ts">
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
</script>

<template>
    <div
        class="w-full h-full flex flex-col gap-0 items-center justify-start text-text bg-bg font-Open-Sans"
    >
        <NavBar />
        <RouterView />
    </div>
</template>
