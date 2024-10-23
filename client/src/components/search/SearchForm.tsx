import { createRef, useState, useEffect } from "react";
import { DropdownField, DropdownOptionType } from "../DropdownField";
import { useDebounce } from "use-debounce";
import axios from "axios";
import { API_URL } from "../../utils/url";
import { OnSubmitFunction } from "../../views/Search";

interface SearchFormProps {
    onSubmit: OnSubmitFunction;
}
const SearchForm = ({ onSubmit }: SearchFormProps) => {
    const stateRef = createRef<HTMLInputElement>();
    const cityRef = createRef<HTMLInputElement>();
    const foodRef = createRef<HTMLInputElement>();
    const cuisinesRef = createRef<HTMLInputElement>();

    const [search, setSearch] = useState("");
    const [debouncedSearch] = useDebounce(search, 250);
    const [options, setOptions] = useState<DropdownOptionType[]>([]);

    const [selectedOptions, setSelectedOptions] = useState<
        Array<string | number>
    >([]);

    const getCuisines = async (search: string) => {
        if (search === "") {
            return setOptions([]);
        }
        const res = await axios.get(`${API_URL}/restaurant/cuisines`, {
            params: {
                search,
            },
            withCredentials: true,
        });
        if (res.status === 200) {
            const optionData: DropdownOptionType[] = res.data.data
                .map((cuisine) => {
                    return {
                        value: cuisine.id,
                        label: cuisine.name,
                    };
                })
                .sort((a, b) => a.label.localeCompare(b.label));
            setOptions(optionData ?? []);
        }
    };

    const onCuisinesInput = (e: React.FormEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        if (!/\d/.test(value)) {
            return setSearch(value);
        }
    };

    useEffect(() => {
        getCuisines(debouncedSearch);
    }, [debouncedSearch]);

    const onOptionSelect = (value: string | number) => {
        setSelectedOptions((prev) => [...prev, value]);
    };

    const onOptionRemove = (value: string | number) => {
        setSelectedOptions((prev) => prev.filter((opt) => opt !== value));
    };

    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            if (
                foodRef.current?.value &&
                foodRef.current?.value.length > 0 &&
                typeof foodRef.current?.value === "string"
            ) {
                onSubmit({
                    state: stateRef.current?.value,
                    city: cityRef.current?.value,
                    food: foodRef.current?.value,
                    cuisines: selectedOptions,
                });
            }
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center border-1 border-solid border-text px-2 gap-1 rounded">
                <input
                    ref={stateRef}
                    type="text"
                    placeholder="State"
                    className="w-24"
                    tabIndex={0}
                    onKeyDown={handleEnter}
                />
                <div className="bg-text h-10 w-px" />
                <input
                    ref={cityRef}
                    type="text"
                    placeholder="City"
                    className="w-32"
                    tabIndex={0}
                    onKeyDown={handleEnter}
                />
                <div className="bg-text h-10 w-px" />
                <input
                    ref={foodRef}
                    type="text"
                    placeholder="Food"
                    className="w-60"
                    tabIndex={0}
                    onKeyDown={handleEnter}
                />
            </div>
            <DropdownField
                dropdownOptions={options}
                onOptionRemove={onOptionRemove}
                onOptionSelect={onOptionSelect}
                maxOptions={5}
                inputProps={{
                    placeholder: "Cuisines",
                    divclassname: "shadow-none",
                    ref: cuisinesRef,
                    tabIndex: 0,
                    onInput: (e) => onCuisinesInput(e),
                    onKeyDown: handleEnter,
                }}
            />
        </div>
    );
};

export default SearchForm;
