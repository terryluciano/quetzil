import { createContext, Dispatch, SetStateAction } from "react";

export const AuthContext = createContext<{
    isAuth: boolean | null;
    setIsAuth: Dispatch<SetStateAction<boolean | null>>;
}>({
    isAuth: null,
    setIsAuth: () => {},
});

export type Toast = {
    id: number;
    message: string;
    type: "success" | "error";
    duration?: number;
};

export const ToastContext = createContext<{
    toasts: Toast[];
    setToasts: Dispatch<SetStateAction<Toast[]>>;
    addToast: (toast: Pick<Toast, "message" | "type" | "duration">) => void;
}>({
    toasts: [],
    setToasts: () => {},
    addToast: () => {},
});
