import { ModalWrapperProps, ModalWrapper } from "./ModalWrapper";
import AuthFormWrapper from "../AuthFormWrapper";
import MultiRangeField from "./MultiRangeField";
import { RestaurantResultType } from "../../views/AddRating";
import { Dispatch, SetStateAction } from "react";

interface MultipleRatingModalProps
    extends Pick<ModalWrapperProps, "open" | "setOpen"> {
    restaurantId: number | null;
    restaurantName: string | null;
    foodItems: RestaurantResultType["foodItems"];
    setOpenNewItemModal: Dispatch<SetStateAction<boolean>>;
}

const MultipleRatingModal = ({
    open,
    setOpen,
    restaurantId,
    restaurantName,
    foodItems,
    setOpenNewItemModal,
}: MultipleRatingModalProps) => {
    return (
        <ModalWrapper open={open} setOpen={setOpen}>
            <AuthFormWrapper
                hideButton
                headerTitle={`${restaurantName}'s Food Items`}
                divClassName="bg-bg pb-0 items-start"
            >
                <div className="flex flex-col gap-6 size-full px-4">
                    {foodItems.map((foodItem, index) => (
                        <MultiRangeField
                            key={index}
                            foodId={foodItem.id}
                            foodName={foodItem.name}
                            restaurantId={restaurantId}
                        />
                    ))}
                </div>
                <button
                    className="rounded bg-primary h-8 px-2.5 font-semibold"
                    onClick={() => {
                        setOpen(false);
                        setOpenNewItemModal(true);
                    }}
                >
                    Add New Food Item &gt;
                </button>
                <div className="flex-center p-2 bg-primary w-full">
                    <button
                        className="bg-text text-bg px-1.5 h-8 rounded text-base font-medium font-Fira-Sans"
                        onClick={() => setOpen(false)}
                    >
                        Submit
                    </button>
                </div>
            </AuthFormWrapper>
        </ModalWrapper>
    );
};

export default MultipleRatingModal;
