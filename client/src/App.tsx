import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./views/Home.tsx";
import AppLayout from "./components/AppLayout.tsx";
import Login from "./views/Login.tsx";
import SignUp from "./views/SignUp.tsx";
import AddRating from "./views/AddRating.tsx";
import Search from "./views/Search.tsx";

function App() {
    return (
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
    );
}

export default App;
