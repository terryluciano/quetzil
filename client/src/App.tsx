import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";

import { AuthContext } from "./Context.ts";

import Home from "./views/Home.tsx";
import AppLayout from "./components/AppLayout.tsx";
import Login from "./views/Login.tsx";
import SignUp from "./views/SignUp.tsx";
import AddRating from "./views/AddRating.tsx";
import Search from "./views/Search.tsx";

function App() {
    const [isAuth, setIsAuth] = useState<boolean | null>(null);

    return (
        <AuthContext.Provider
            value={{
                isAuth,
                setIsAuth,
            }}
        >
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<AppLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/sign-up" element={<SignUp />} />
                        <Route path="/add-rating" element={<AddRating />} />
                        <Route path="/search" element={<Search />} />
                    </Route>
                    <Route path="/*" element={<h1>404</h1>} />
                </Routes>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

export default App;
