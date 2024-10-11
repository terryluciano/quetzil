import { useContext, useEffect, useMemo, useState } from "react";
import { Toast, ToastContext } from "../Context";

const ToastCard = ({ toast }: { toast: Toast }) => {
    const { setToasts } = useContext(ToastContext);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => {
                setToasts((prevToasts) =>
                    prevToasts.filter((t) => t.id !== toast.id),
                );
            }, 200);
        }, toast.duration ?? 3000);
    }, []);

    return (
        <div
            className={`flex flex-col bg-gray-800 w-64 h-16 p-2 text-bg rounded ${
                isVisible
                    ? "animate-toast-enter"
                    : "transition-all duration-200 translate-x-full opacity-0"
            }`}
        >
            <p className="text-base font-Fira-Sans font-medium">
                {toast.type.toUpperCase()}
            </p>
            <p className="text-xs">{toast.message}</p>
        </div>
    );
};

export const Toaster = () => {
    const { toasts } = useContext(ToastContext);

    const renderedToasts = useMemo(() => {
        // remove duplicates toasts
        return toasts.filter(
            (toast, i, arr) =>
                arr.findIndex((t) => t.message === toast.message) == i,
        );
    }, [toasts]);

    useEffect(() => {
        console.log(renderedToasts);
    }, [renderedToasts]);

    return (
        <div className="fixed bottom-2 right-2 flex flex-col gap-2 z-10">
            {renderedToasts.map((toast) => (
                <ToastCard key={toast.id} toast={toast} />
            ))}
        </div>
    );
};

export default Toaster;
