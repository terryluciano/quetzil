import { twMerge } from "tailwind-merge";
import React, { HTMLAttributes } from "react";

interface AuthFormWrapperProps {
    divClassName?: string;
    children: React.ReactNode;
    headerTitle?: string;
    formTitle?: string;
    formSubTitle?: string;
    footerChildren?: React.ReactNode;
    hideButton?: boolean;
    buttonText?: string;
    buttonProps?: HTMLAttributes<HTMLButtonElement>;
}

const AuthFormWrapper = ({
    divClassName = "",
    children,
    headerTitle = "Quetzil",
    formTitle,
    formSubTitle,
    footerChildren,
    buttonText,
    buttonProps,
    hideButton = false,
}: AuthFormWrapperProps) => {
    return (
        <div
            className={twMerge(
                "w-full max-w-[400px] flex-center flex-col border-1 border-solid border-text rounded-xl gap-6 pb-6 overflow-hidden",
                divClassName,
            )}
        >
            <div className="flex-center py-3 w-full bg-primary rounded-t-[11px]">
                <p className="font-semibold font-Fira-Sans text-32">
                    {headerTitle}
                </p>
            </div>
            {(formTitle || formSubTitle) && (
                <div className="flex-center flex-col gap-2 font-Fira-Sans -mb-4">
                    <p className="text-2xl font-medium">{formTitle}</p>
                    <p className="text-base font-normal">{formSubTitle}</p>
                </div>
            )}
            {children}
            {!hideButton && (
                <button
                    {...buttonProps}
                    className={twMerge(
                        "bg-primary hover:bg-primary-hover transition-all duration-200 ease-in-out text text-xl font-medium font-Fira-Sans px-2 rounded h-10 hover:text-text-hover disabled:opacity-50",
                        buttonProps?.className,
                    )}
                >
                    {buttonText}
                </button>
            )}
            {footerChildren}
        </div>
    );
};

export default AuthFormWrapper;
