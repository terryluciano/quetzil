import { createRef, useContext, useEffect, useState } from "react";
import { ModalWrapperProps, ModalWrapper } from "./ModalWrapper";
import AuthFormWrapper from "../AuthFormWrapper";
import { RangeField } from "../InputField";
import axios from "axios";
import { API_URL } from "../../utils/url";
import { ToastContext } from "../../Context";

interface AddRatingModalProps
    extends Pick<ModalWrapperProps, "open" | "setOpen"> {
    restaurantId: number | null;
    restaurantName: string | null;
    foodId: number | null;
    foodName: string | null;
}

const AddRatingModal = ({
    open,
    setOpen,
    restaurantId,
    restaurantName,
    foodId,
    foodName,
}: AddRatingModalProps) => {
    const { addToast } = useContext(ToastContext);

    const ratingInputRef = createRef<HTMLInputElement>();

    const [currentRating, setCurrentRating] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);

    const getRating = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${API_URL}/food/user-rating`, {
                params: {
                    foodId,
                    restaurantId,
                },
                withCredentials: true,
            });
            if (res.status === 200) {
                if (res.data.data.rating) {
                    setCurrentRating(res.data.data.rating);
                    if (
                        ratingInputRef.current &&
                        ratingInputRef.current.value
                    ) {
                        ratingInputRef.current.value = res.data.data.rating;
                    }
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (open && restaurantId && foodId) {
            getRating();
        }
        return () => {
            setCurrentRating(0);
            setIsLoading(true);
        };
    }, [open, restaurantId, foodId]);

    const onSubmit = async () => {
        try {
            const res = await axios.post(
                `${API_URL}/food/add-rating`,
                {
                    foodId,
                    restaurantId,
                    rating: currentRating,
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

    return (
        <ModalWrapper open={open} setOpen={setOpen}>
            <AuthFormWrapper
                hideButton
                headerTitle="Add Rating"
                divClassName="bg-bg pb-0 items-start"
            >
                <div className="flex flex-col gap-3 size-full px-4">
                    <div className="flex flex-col gap-1">
                        <p className="font-normal text-base font-Open-Sans">
                            Restaurant:{" "}
                            <span className="font-semibold">
                                {restaurantName}
                            </span>
                        </p>
                        <p className="text-xl font-semibold font-Open-Sans">
                            {foodName}
                        </p>
                    </div>
                    <p className="text-xs text-placeholder-text font-Open-Sans -mb-3">
                        Rating
                    </p>
                    <RangeField
                        ref={ratingInputRef}
                        currentValue={currentRating}
                        setCurrentValue={setCurrentRating}
                        min={0}
                        max={10}
                        step={1}
                        disabled={isLoading}
                    />
                </div>
                <div className="flex-center p-2 bg-primary w-full">
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

export default AddRatingModal;
