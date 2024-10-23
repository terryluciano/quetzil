import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { ToastContext } from "../Context";
import { InputField, InputProps } from "./InputField";

export type DropdownOptionType = {
    value: string | number;
    label: string;
};

const DropdownOption = ({ label }: Pick<DropdownOptionType, "label">) => {
    return (
        <div className="flex items-center flex-row gap-2 w-full bg-gray-100 text-placeholder-text hover:text-text hover:bg-gray-300 h-8 px-2 cursor-pointer select-none">
            <p>{label}</p>
        </div>
    );
};

interface DropdownProps {
    inputProps?: InputProps;
    dropdownOptions?: DropdownOptionType[];
    onOptionSelect?: (value: string | number) => void;
    onOptionRemove?: (value: string | number) => void;
    maxOptions?: number;
}

export const DropdownField = ({
    inputProps,
    dropdownOptions = [],
    onOptionSelect,
    onOptionRemove,
    maxOptions,
}: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<
        DropdownOptionType[]
    >([]);
    const { addToast } = useContext(ToastContext);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Handle outside click to close the dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const selectedOptionsDiv = useMemo((): JSX.Element => {
        return (
            <div className="flex flex-row gap-1 w-auto -ml-2">
                {selectedOptions.map((option) => (
                    <div
                        key={option.value}
                        className="border-1 rounded border-solid border-black h-8 px-1 flex-center cursor-pointer max-w-28"
                        onClick={() => {
                            onOptionRemove?.(option.value);
                            setSelectedOptions(
                                selectedOptions.filter(
                                    (opt) => opt.value !== option.value,
                                ),
                            );
                        }}
                    >
                        <p className="text-xs text-nowrap text-ellipsis overflow-hidden">
                            {option.label}
                        </p>
                    </div>
                ))}
            </div>
        );
    }, [selectedOptions]);

    return (
        <div ref={dropdownRef} className="relative w-full">
            <InputField
                {...inputProps}
                onFocus={() => setIsOpen(true)}
                lefticon={
                    selectedOptions.length > 0 ? selectedOptionsDiv : null
                }
            />
            <div
                className={`absolute top-full right-0 z-10 w-full transition-all duration-150 origin-top h-auto overflow-y-scroll flex flex-col justify-start items-center ${isOpen ? "opacity-100 max-h-48 scale-y-100" : "opacity-0 scale-y-0 max-h-0"}`}
            >
                {dropdownOptions
                    .filter((option) => {
                        return (
                            selectedOptions.findIndex(
                                (opt) => opt.value === option.value,
                            ) === -1
                        );
                    })
                    .map((option) => (
                        <div
                            className="w-full"
                            key={option.value}
                            onClick={() => {
                                if (
                                    maxOptions &&
                                    selectedOptions.length >= maxOptions
                                ) {
                                    return addToast({
                                        message: `You can only select ${maxOptions} options`,
                                        type: "error",
                                    });
                                }
                                onOptionSelect?.(option.value);

                                setSelectedOptions([
                                    ...selectedOptions,
                                    option,
                                ]);
                                setIsOpen(false);
                            }}
                        >
                            <DropdownOption {...option} />
                        </div>
                    ))}
            </div>
        </div>
    );
};
