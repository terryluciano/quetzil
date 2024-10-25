import {
    Dispatch,
    forwardRef,
    HTMLProps,
    ReactNode,
    SetStateAction,
} from "react";
import { twMerge } from "tailwind-merge";

export interface InputProps extends HTMLProps<HTMLInputElement> {
    divclassname?: string;
    righticon?: ReactNode | JSX.Element;
    lefticon?: ReactNode | JSX.Element;
}

export const InputField = forwardRef<HTMLInputElement, InputProps>(
    (props, ref) => (
        <div
            className={twMerge(
                "w-full shadow-input gap-2 flex-center flex-row border-b-[1px] border-b-solid border-text px-2",
                props?.divclassname,
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

export interface RangeFieldProps extends HTMLProps<HTMLInputElement> {
    divclassname?: string;
    currentValue?: number;
    setCurrentValue: Dispatch<SetStateAction<number>>;
    min?: number;
    max?: number;
    step?: number;
}

export const RangeField = forwardRef<HTMLInputElement, RangeFieldProps>(
    (props, ref) => (
        <div
            className={twMerge(
                "flex flex-row gap-2 items-center justify-between w-full",
                props?.divclassname,
            )}
        >
            <input
                ref={ref}
                type="range"
                value={props.currentValue}
                onInput={(e) =>
                    props.setCurrentValue(Number(e.currentTarget.value))
                }
                className={twMerge("w-full", props.className)}
                min={props.min}
                max={props.max}
                step={props.step}
                disabled={props.disabled}
            />
            <p className="flex-shrink-0 text-text font-Open-Sans min-w-[52px] text-right">
                {props.currentValue} / {props.max}
            </p>
        </div>
    ),
);
