import { createRouter, createWebHistory } from "vue-router";
import type { RouterOptions } from "vue-router";

import HomeView from "./views/HomeView.vue";
import LoginView from "./views/LoginView.vue";
import SignUpView from "./views/SignUpView.vue";
import SearchView from "./views/SearchView.vue";
import AddRatingView from "./views/AddRating.vue";

const routes: RouterOptions["routes"] = [
    { path: "/", component: HomeView, name: "home" },
    {
        path: "/login",
        component: LoginView,
        name: "login",
    },
    {
        path: "/sign-up",
        component: SignUpView,
        name: "signUp",
    },
    {
        path: "/add-rating",
        component: AddRatingView,
        name: "addRating",
    },
    {
        path: "/search",
        component: SearchView,
        name: "search",
    },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});
