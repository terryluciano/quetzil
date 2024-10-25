import { createRef, Dispatch, SetStateAction } from "react";

export interface ModalWrapperProps {
    children: React.ReactNode;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export const ModalWrapper = ({
    children,
    open,
    setOpen,
}: ModalWrapperProps) => {
    const modalRef = createRef<HTMLDivElement>();
    return (
        <>
            {open && (
                <div
                    ref={modalRef}
                    className="fixed top-0 left-0 w-screen h-screen bg-black/30 z-10 flex-center"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (e.target == modalRef.current) {
                            setOpen(false);
                        }
                    }}
                >
                    {children}
                </div>
            )}
        </>
    );
};
