import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

const AppLayout = () => {
    return (
        <div className="w-full h-full flex flex-col gap-0 items-center justify-start text-text bg-bg font-Open-Sans">
            <NavBar />
            <Outlet />
        </div>
    );
};

export default AppLayout;
