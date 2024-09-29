import { Link } from "react-router-dom";
import largeLogo from "../assets/large-logo.svg";

const NavBar = () => {
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

    return (
        <>
            <nav className="w-full h-[104px] grid grid-cols-3 justify-center items-center align-middle place-content-center px-8 font-Fira-Sans font-medium text-xl">
                <Link to="/">
                    <img
                        src={largeLogo}
                        className="h-12 transition-all ease-in-out hover:drop-shadow-lg hover:scale-105 active:scale-100"
                    />
                </Link>
                <div className="w-full flex-center flex-row gap-6 self-center">
                    {links.map((link, i) => (
                        <Link
                            to={link.link}
                            className="transition-all ease-in-out hover:text-primary active:text-primary active:scale-95"
                            key={i}
                        >
                            {link.text}
                        </Link>
                    ))}
                </div>
                <div className="flex flex-row justify-end self-center">
                    <Link
                        to="/login"
                        className="flex-center rounded-xl px-3 h-10 transition-all ease-in-out bg-text hover:bg-text-hover text-bg active:bg-text-hover active:scale-95 cursor-pointer"
                    >
                        Login
                    </Link>
                </div>
            </nav>
        </>
    );
};

export default NavBar;
