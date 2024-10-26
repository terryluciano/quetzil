import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { API_URL } from "../utils/url";
import axios from "axios";
import { useContext, useEffect } from "react";
import { AuthContext, ToastContext } from "../Context";
import Toaster from "./Toaster";

const AppLayout = () => {
    const { setIsAuth } = useContext(AuthContext);
    const { addToast } = useContext(ToastContext);

    const getAuthStatus = async () => {
        try {
            const res = await axios.get(`${API_URL}/auth/status`, {
                withCredentials: true,
            });
            if (res.status === 200) {
                setIsAuth(true);
            } else {
                setIsAuth(false);
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return addToast({
                    message: err.response?.data?.msg,
                    type: "error",
                });
            }
            console.error(err);
        }
    };

    useEffect(() => {
        getAuthStatus();
    }, []);

    return (
        <div className="relative w-full h-full flex flex-col gap-0 items-center justify-start text-text bg-bg font-Open-Sans">
            <NavBar />
            <Toaster />
            <Outlet />
        </div>
    );
};

export default AppLayout;
