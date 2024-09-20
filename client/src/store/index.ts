import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
    const auth = ref<boolean>(true);

    return { auth };
});
