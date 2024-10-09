import { createContext, Dispatch, SetStateAction } from "react";

export const AuthContext = createContext<{
    isAuth: boolean | null;
    setIsAuth: Dispatch<SetStateAction<boolean | null>>;
}>({
    isAuth: null,
    setIsAuth: () => {},
});
