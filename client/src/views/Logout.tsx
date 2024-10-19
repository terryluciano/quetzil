import { useContext, useEffect } from "react";
import { AuthContext, ToastContext } from "../Context";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/url";
import axios from "axios";

const Logout = () => {
    const navigate = useNavigate();

    const { isAuth, setIsAuth } = useContext(AuthContext);
    const { addToast } = useContext(ToastContext);

    const logout = async () => {
        try {
            const res = await axios.post(
                `${API_URL}/auth/logout`,
                {},
                {
                    withCredentials: true,
                },
            );
            if (res.status === 200) {
                setIsAuth(false);
            }
            return addToast({
                message: res.data?.msg,
                type: res.data?.error ? "error" : "success",
            });
        } catch (e) {
            console.error(e);
            return addToast({
                message: "Error occurred while logging out",
                type: "error",
            });
        } finally {
            navigate("/");
        }
    };

    useEffect(() => {
        if (!isAuth) {
            navigate("/");
        } else {
            logout();
        }
    }, []);

    return <div>Logout</div>;
};

export default Logout;
