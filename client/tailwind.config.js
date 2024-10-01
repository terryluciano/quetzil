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
        },
    },
    plugins: [],
};
