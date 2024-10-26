import axios from "axios";
import {
    createRef,
    HTMLAttributes,
    useContext,
    useEffect,
    useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";
import AuthFormWrapper from "../components/AuthFormWrapper";
import { DropdownField, DropdownOptionType } from "../components/DropdownField";
import { InputField } from "../components/InputField";
import { ToastContext } from "../Context";
import { API_URL } from "../utils/url";

const AddRestaurant = () => {
    const { addToast } = useContext(ToastContext);
    const navigate = useNavigate();

    const restaurantNameRef = createRef<HTMLInputElement>();
    const cuisinesRef = createRef<HTMLInputElement>();
    const websiteRef = createRef<HTMLInputElement>();
    const addressRef = createRef<HTMLInputElement>();
    const cityRef = createRef<HTMLInputElement>();
    const stateRef = createRef<HTMLInputElement>();
    const zipCodeRef = createRef<HTMLInputElement>();

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
            const data = res.data.data as { id: number; name: string }[];
            const optionData: DropdownOptionType[] = data
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

    const submitForm = async () => {
        try {
            const name = restaurantNameRef.current?.value;
            const cuisines = selectedOptions;
            const website = websiteRef.current?.value;
            const address = addressRef.current?.value;
            const city = cityRef.current?.value;
            const state = stateRef.current?.value;
            const zipCode = Number(zipCodeRef.current?.value);

            const restaurantData = {
                name,
                cuisines,
                website,
                address,
                city,
                state,
                zipCode,
            };

            if (!name || !cuisines || !address || !city || !state || !zipCode) {
                return addToast({
                    message: "Please fill all the fields",
                    type: "error",
                });
            } else {
                const res = await axios.post(
                    `${API_URL}/restaurant/add`,
                    restaurantData,
                    {
                        withCredentials: true,
                    },
                );
                if (res.status === 200) {
                    navigate("/");
                }
                return addToast({
                    message: res.data?.msg,
                    type: res.data?.error ? "error" : "success",
                });
            }
        } catch (err) {
            console.error(err);
            if (axios.isAxiosError(err)) {
                return addToast({
                    message: err.response?.data?.msg,
                    type: err.response?.data?.error ? "error" : "success",
                });
            }
            return addToast({
                message: "Failed to add restaurant",
                type: "error",
            });
        }
    };

    const buttonProps: HTMLAttributes<HTMLButtonElement> = {
        onClick: submitForm,
    };

    return (
        <div className="flex-center pt-32 w-full h-full">
            <AuthFormWrapper
                headerTitle="Add a Restaurant"
                buttonText="Submit"
                buttonProps={buttonProps}
                divClassName="overflow-visible"
            >
                <div className="flex flex-col gap-2 w-full px-8">
                    <InputField
                        placeholder="Restaurant Name"
                        divclassname="shadow-none"
                        ref={restaurantNameRef}
                        tabIndex={0}
                        required
                    />
                    <DropdownField
                        dropdownOptions={options}
                        onOptionRemove={onOptionRemove}
                        onOptionSelect={onOptionSelect}
                        maxOptions={3}
                        inputProps={{
                            placeholder: "Cuisines",
                            divclassname: "shadow-none",
                            ref: cuisinesRef,
                            tabIndex: 0,
                            onInput: (e) => onCuisinesInput(e),
                        }}
                    />
                    <InputField
                        placeholder="Website"
                        divclassname="shadow-none"
                        ref={websiteRef}
                        tabIndex={0}
                    />
                    <InputField
                        placeholder="Address"
                        divclassname="shadow-none"
                        ref={addressRef}
                        tabIndex={0}
                        required
                    />
                    <InputField
                        placeholder="City"
                        divclassname="shadow-none"
                        ref={cityRef}
                        tabIndex={0}
                        required
                    />
                    <InputField
                        placeholder="State"
                        divclassname="shadow-none"
                        ref={stateRef}
                        tabIndex={0}
                        required
                    />

                    <InputField
                        placeholder="Zip Code"
                        divclassname="shadow-none"
                        ref={zipCodeRef}
                        tabIndex={0}
                        required
                    />
                </div>
            </AuthFormWrapper>
        </div>
    );
};

export default AddRestaurant;
