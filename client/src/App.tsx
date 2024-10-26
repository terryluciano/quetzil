import { useState, lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthContext, Toast, ToastContext } from "./Context.ts";

import AppLayout from "./components/AppLayout.tsx";

const AddRating = lazy(() => import("./views/AddRating.tsx"));
const AddRestaurant = lazy(() => import("./views/AddRestaurant.tsx"));
const Home = lazy(() => import("./views/Home.tsx"));
const Login = lazy(() => import("./views/Login.tsx"));
const Logout = lazy(() => import("./views/Logout.tsx"));
const Search = lazy(() => import("./views/Search.tsx"));
const SignUp = lazy(() => import("./views/SignUp.tsx"));

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
                    <Suspense
                        fallback={
                            <div className="w-full h-full flex-center">
                                <p>Loading...</p>
                            </div>
                        }
                    >
                        <Routes>
                            <Route path="/" element={<AppLayout />}>
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/logout" element={<Logout />} />
                                <Route path="/sign-up" element={<SignUp />} />
                                <Route
                                    path="/add-rating"
                                    element={<AddRating />}
                                />
                                <Route path="/search" element={<Search />} />
                                <Route
                                    path="/add-restaurant"
                                    element={<AddRestaurant />}
                                />
                            </Route>
                            <Route path="/*" element={<h1>404</h1>} />
                        </Routes>
                    </Suspense>
                </BrowserRouter>
            </ToastContext.Provider>
        </AuthContext.Provider>
    );
}

export default App;
