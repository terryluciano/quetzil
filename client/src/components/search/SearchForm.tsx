import { createRef, useState, useEffect, useContext } from "react";
import { DropdownField, DropdownOptionType } from "../DropdownField";
import { useDebounce } from "use-debounce";
import axios from "axios";
import { API_URL } from "../../utils/url";
import { OnSubmitFunction } from "../../views/Search";
import { ToastContext } from "../../Context";

interface SearchFormProps {
    onSubmit: OnSubmitFunction;
}
const SearchForm = ({ onSubmit }: SearchFormProps) => {
    const { addToast } = useContext(ToastContext);

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

    const [foodOptions, setFoodOptions] = useState<DropdownOptionType[]>([]);
    const [foodTerm, setFoodTerm] = useState("");
    const [selectedFood, setSelectedFood] =
        useState<DropdownOptionType | null>();

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
            const data = res.data.data;
            const optionData: DropdownOptionType[] = (
                data as {
                    id: number;
                    name: string;
                }[]
            )
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

    const getFoodItems = async () => {
        try {
            const res = await axios.get(`${API_URL}/food/items`, {
                params: {
                    all: "true",
                },
                withCredentials: true,
            });
            if (res.status === 200) {
                const data = res.data.data;
                const filteredData: DropdownOptionType[] = (
                    data as { id: number; name: string }[]
                )
                    ?.map((item) => {
                        return {
                            value: item.id,
                            label: item.name,
                        };
                    })
                    .sort((a, b) => a.label.localeCompare(b.label));

                setFoodOptions(filteredData);
            }
        } catch (err) {
            console.error(err);
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

    const handleSubmit = () => {
        if (selectedFood?.value) {
            onSubmit({
                state: stateRef.current?.value,
                city: cityRef.current?.value,
                foodId: Number(selectedFood?.value),
                cuisines: selectedOptions,
            });
        } else {
            addToast({
                message: "Please select a food",
                type: "error",
            });
        }
    };

    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            if (
                foodRef.current?.value &&
                foodRef.current?.value.length > 0 &&
                typeof foodRef.current?.value === "string"
            ) {
                handleSubmit();
            }
        }
    };

    useEffect(() => {
        getFoodItems();
    }, []);

    return (
        <div className="flex flex-col gap-2 w-full max-w-[512px]">
            <div className="flex flex-row items-center border-1 border-solid border-text px-2 gap-1 rounded-lg w-full">
                <input
                    ref={stateRef}
                    type="text"
                    placeholder="State"
                    className="w-[40%]"
                    tabIndex={0}
                    onKeyDown={handleEnter}
                />
                <div className="bg-text h-10 w-px" />
                <input
                    ref={cityRef}
                    type="text"
                    placeholder="City"
                    className="w-[60%]"
                    tabIndex={0}
                    onKeyDown={handleEnter}
                />
            </div>
            <DropdownField
                dropdownOptions={foodOptions.filter((item) =>
                    item.label.toLowerCase().includes(foodTerm.toLowerCase()),
                )}
                onOptionRemove={(value) => {
                    console.log(value);
                    setSelectedFood(null);
                }}
                onOptionSelect={(value) => {
                    const item = foodOptions.find(
                        (item) => item.value === value,
                    );
                    setSelectedFood(item);
                }}
                maxOptions={1}
                inputProps={{
                    placeholder: "Food",
                    divclassname: "shadow-none",
                    ref: foodRef,
                    tabIndex: 0,
                    onInput: (e) => {
                        setFoodTerm(e.currentTarget.value);
                    },
                }}
            />
            <div className="flex flex-row gap-2 justify-start items-end w-full">
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
                    }}
                />
                <button
                    className="bg-primary text-text font-Fira-Sans font-medium text-xl h-10 px-2 rounded"
                    onClick={handleSubmit}
                >
                    Search
                </button>
            </div>
        </div>
    );
};

export default SearchForm;
