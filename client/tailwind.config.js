/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
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
            fontSize: {
                32: "2rem",
            },
            boxShadow: {
                input: "0 6px 4px -4px rgba(0, 0, 0, 0.2)",
            },
            borderWidth: {
                1: "1px",
            },
            animation: {
                "toast-enter": "slide-in-right 0.2s ease-in-out",
                "toast-exit": "slide-in-right reverse 0.2s ease-in-out",
            },
            keyframes: {
                "slide-in-right": {
                    "0%": {
                        transform: "translateX(100%)",
                        opacity: 0,
                    },
                    "100%": {
                        transform: "translateX(0)",
                        opacity: 1,
                    },
                },
            },
        },
    },
    plugins: [],
};
