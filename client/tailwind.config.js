/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        fontFamily: {
            "Fira-Sans": ["Fira Sans", "sans-serif"],
            "Open-Sans": ["Open Sans", "sans-serif"],
        },
        extend: {
            colors: {
                primary: "#FF4F00",
                text: "#000000",
                bg: "#FFFFFA",
                "primary-hover": "#FF7433",
                "text-hover": "#39332D",
                "placeholder-text": "#7A7A7A",
            },
        },
    },
    plugins: [],
};
