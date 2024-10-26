import { createRef, useContext, useEffect, useState } from "react";
import { RangeField } from "../InputField";
import axios from "axios";
import { API_URL } from "../../utils/url";
import { ToastContext } from "../../Context";

interface MultiRangeFieldProps {
    foodId: number;
    foodName: string;
    restaurantId: number | null;
}

const MultiRangeField = ({
    foodId,
    foodName,
    restaurantId,
}: MultiRangeFieldProps) => {
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
                    setCurrentRating(res.data.data.rating || 0);
                    if (
                        ratingInputRef.current &&
                        ratingInputRef.current.value
                    ) {
                        ratingInputRef.current.value =
                            res.data.data.rating || 0;
                    }
                }
            }
        } catch (err) {
            if (axios.isAxiosError(err)) return;
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const submitRating = async () => {
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
        if (restaurantId && foodId) {
            getRating();
        }
    }, [restaurantId, foodId]);

    return (
        <div className="flex flex-col gap-0 items-start w-full flex-shrink-0">
            <p>{foodName}</p>
            <p className="text-xs text-placeholder-text font-Open-Sans">
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
                onBlur={submitRating}
            />
        </div>
    );
};

export default MultiRangeField;
