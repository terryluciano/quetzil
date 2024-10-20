import { createRef, useEffect, useRef, useState } from "react";
import homeBanner from "../assets/home-banner.png";
import searchIcon from "../assets/icons/search-icon.svg";
import { InputField } from "../components/InputField";

const listOfFoodPlaceHolders = [
    "Cookies",
    "Food",
    "Something Yummy",
    "Pasta",
    "Pizza",
    "Chicken",
    "Brisket",
    "Hamburger",
    "Sushi",
    "Tacos",
    "Burrito",
    "Hoagie",
    "Salad",
    "Soup",
    "Steak",
];

const SearchIcon = () => {
    return <img src={searchIcon} className="size-6" />;
};

const Home = () => {
    const stateRef = createRef<HTMLInputElement>();
    const cityRef = createRef<HTMLInputElement>();
    const foodRef = createRef<HTMLInputElement>();

    const [foodPlaceholder, setFoodPlaceholder] = useState("Food");

    const placeholderInterval = useRef<ReturnType<typeof setInterval>>();

    // run effect every 2 seconds
    useEffect(() => {
        placeholderInterval.current = setInterval(() => {
            const randomNumber = Math.floor(
                Math.random() * listOfFoodPlaceHolders.length,
            );
            setFoodPlaceholder(listOfFoodPlaceHolders[randomNumber]);
        }, 2000);

        return () => clearInterval(placeholderInterval.current);
    }, []);

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
                    <span className="text-primary">Want</span> it.{" "}
                    <span className="text-primary">Find</span> it.{" "}
                    <span className="text-primary">Eat</span> it.
                </h1>
            </div>
            <div className="flex-center flex-col gap-6 h-auto w-[400px]">
                <p className="text-xl font-semibold">What are you Craving?</p>
                <div className="gap-2 flex-center flex-col w-full">
                    <div className="flex flex-row justify-center items-center w-full gap-2">
                        <InputField
                            ref={stateRef}
                            type="text"
                            placeholder="State"
                        />
                        <InputField
                            ref={cityRef}
                            type="text"
                            placeholder="City"
                        />
                    </div>
                    <InputField
                        ref={foodRef}
                        type="text"
                        placeholder={foodPlaceholder}
                        righticon={<SearchIcon />}
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;
