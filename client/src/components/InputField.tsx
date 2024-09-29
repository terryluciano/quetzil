import { forwardRef, HTMLProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends HTMLProps<HTMLInputElement> {
    divClassName?: string;
    righticon?: ReactNode | JSX.Element;
    lefticon?: ReactNode | JSX.Element;
}

export const InputField = forwardRef<HTMLInputElement, InputProps>(
    (props, ref) => (
        <div
            className={twMerge(
                "w-full shadow-input gap-2 flex-center flex-row border-b-[1px] border-b-solid border-text px-2",
                props?.divClassName,
            )}
        >
            {props?.lefticon}
            <input
                {...props}
                ref={ref}
                className={twMerge(
                    "w-full h-10 text-base placeholder:text-placeholder-text bg-transparent",
                    props.className,
                )}
            />
            {props?.righticon}
        </div>
    ),
);
