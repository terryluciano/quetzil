import { createContext, Dispatch, SetStateAction } from "react";

export const AuthContext = createContext<{
    isAuth: boolean | null;
    setIsAuth: Dispatch<SetStateAction<boolean | null>>;
}>({
    isAuth: null,
    setIsAuth: () => {},
});

export type Toast = {
    message: string;
    type: "success" | "error" | "info";
    duration?: number;
};

export const ToastContext = createContext<{
    toasts: Toast[];
    setToasts: Dispatch<SetStateAction<Toast[]>>;
    addToast: (toast: Toast) => void;
}>({
    toasts: [],
    setToasts: () => {},
    addToast: () => {},
});
