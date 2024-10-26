import { createRef, useContext, useEffect, useState } from "react";
import { ModalWrapperProps, ModalWrapper } from "./ModalWrapper";
import AuthFormWrapper from "../AuthFormWrapper";
import { RangeField } from "../InputField";
import axios from "axios";
import { API_URL } from "../../utils/url";
import { ToastContext } from "../../Context";
import { DropdownField, DropdownOptionType } from "../DropdownField";

interface AddRatingModalProps
    extends Pick<ModalWrapperProps, "open" | "setOpen"> {
    restaurantId: number | null;
    restaurantFoodItems: Array<{ id: number; name: string }>;
}

const NewFoodItemModal = ({
    open,
    setOpen,
    restaurantId,
    restaurantFoodItems,
}: AddRatingModalProps) => {
    const { addToast } = useContext(ToastContext);

    const foodItemRef = createRef<HTMLInputElement>();

    const [foodOptions, setFoodOptions] = useState<DropdownOptionType[]>([]);
    const [foodTerm, setFoodTerm] = useState("");
    const [selectedFood, setSelectedFood] =
        useState<DropdownOptionType | null>();

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
                    ?.filter(
                        (item) =>
                            !restaurantFoodItems.find(
                                (item2) => item2.id == item.id,
                            ),
                    )
                    .map((item) => {
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

    const onSubmit = async () => {
        try {
            const res = await axios.post(
                `${API_URL}/restaurant/add-food-item`,
                {
                    foodId: selectedFood?.value,
                    restaurantId,
                },
                {
                    withCredentials: true,
                },
            );

            if (res.status === 200) {
                setOpen(false);
                addToast({
                    message: res.data.msg,
                    type: "success",
                });
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                addToast({
                    message: err.response?.data?.msg,
                    type: "error",
                });
            }
            console.error(err);
        }
    };

    useEffect(() => {
        getFoodItems();
    }, []);

    return (
        <ModalWrapper open={open} setOpen={setOpen}>
            <AuthFormWrapper
                hideButton
                headerTitle="Add New Food Item"
                divClassName="bg-bg pb-0 items-start overflow-visible"
            >
                <div className="flex flex-col gap-3 size-full px-4">
                    <p className="text-base text-text font-Open-Sans">
                        Add New Food Item
                    </p>
                    <DropdownField
                        dropdownOptions={foodOptions.filter((item) =>
                            item.label
                                .toLowerCase()
                                .includes(foodTerm.toLowerCase()),
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
                            ref: foodItemRef,
                            tabIndex: 0,
                            onInput: (e) => {
                                setFoodTerm(e.currentTarget.value);
                            },
                        }}
                    />
                </div>
                <div className="flex-center p-2 bg-primary w-full rounded-b-[11px]">
                    <button
                        className="bg-text text-bg px-1.5 h-8 rounded text-base font-medium font-Fira-Sans"
                        onClick={onSubmit}
                    >
                        Submit
                    </button>
                </div>
            </AuthFormWrapper>
        </ModalWrapper>
    );
};

export default NewFoodItemModal;
