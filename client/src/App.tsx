import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthContext, Toast, ToastContext } from "./Context.ts";

import AppLayout from "./components/AppLayout.tsx";
import AddRating from "./views/AddRating.tsx";
import Home from "./views/Home.tsx";
import Login from "./views/Login.tsx";
import Logout from "./views/Logout.tsx";
import Search from "./views/Search.tsx";
import SignUp from "./views/SignUp.tsx";
import AddRestaurant from "./views/AddRestaurant.tsx";

function App() {
    const [isAuth, setIsAuth] = useState<boolean | null>(null);
    const [toasts, setToasts] = useState<Toast[]>([]);
    const addToast = (toast: Pick<Toast, "message" | "type" | "duration">) => {
        const id = Math.floor(Math.random() * 1000000000);

        setToasts([
            {
                id,
                message: toast.message,
                type: toast.type,
                duration: toast.duration,
            },
        ]);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuth,
                setIsAuth,
            }}
        >
            <ToastContext.Provider
                value={{
                    toasts,
                    setToasts,
                    addToast,
                }}
            >
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<AppLayout />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/logout" element={<Logout />} />
                            <Route path="/sign-up" element={<SignUp />} />
                            <Route path="/add-rating" element={<AddRating />} />
                            <Route path="/search" element={<Search />} />
                            <Route
                                path="/add-restaurant"
                                element={<AddRestaurant />}
                            />
                        </Route>
                        <Route path="/*" element={<h1>404</h1>} />
                    </Routes>
                </BrowserRouter>
            </ToastContext.Provider>
        </AuthContext.Provider>
    );
}

export default App;
