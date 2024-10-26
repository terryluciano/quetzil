import axios from "axios";
import { API_URL } from "../utils/url";
import { useContext, useState } from "react";
import { AuthContext, ToastContext } from "../Context";
import SearchRestaurantForm from "../components/add-a-rating/SearchRestaurantForm";
import RestaurantResults from "../components/add-a-rating/RestaurantResults";
import MultipleRatingModal from "../components/modals/MultipleRatingModal";
import NewFoodItemModal from "../components/modals/NewFoodItemModal";

export interface RestaurantResultType {
    id: number;
    name: string;
    address: string;
    state: string;
    city: string;
    zipCode: number;
    website: string | null;
    cuisines: {
        id: number;
        name: string;
    }[];
    foodItems: {
        id: number;
        name: string;
    }[];
}

export type OnSearchFunctionParams = {
    name?: string;
    state?: string;
    city?: string;
};

export type OnSearchFunction = (
    options: OnSearchFunctionParams,
) => Promise<void>;

const AddRating = () => {
    const { isAuth } = useContext(AuthContext);
    const { addToast } = useContext(ToastContext);

    const [results, setResults] = useState<RestaurantResultType[]>([]);
    const [openRatingModal, setOpenRatingModal] = useState(false);
    const [openNewItemModal, setOpenNewItemModal] = useState(false);

    const [currentRestaurantName, setCurrentRestaurantName] = useState<
        string | null
    >(null);
    const [currentRestaurantId, setCurrentRestaurantId] = useState<
        number | null
    >(null);
    const [currentFoodItems, setCurrentFoodItems] = useState<
        RestaurantResultType["foodItems"]
    >([]);

    const onSearch: OnSearchFunction = async ({ name, state, city }) => {
        try {
            if (
                (name == "" || name == undefined) &&
                (state == "" || state == undefined) &&
                (city == "" || city == undefined)
            ) {
                return addToast({
                    message: "Please fill in at least one field",
                    type: "error",
                });
            }

            const res = await axios.get(`${API_URL}/restaurant/search`, {
                params: {
                    restaurant: name == "" ? undefined : name,
                    state: state == "" ? undefined : state,
                    city: city == "" ? undefined : city,
                },
            });

            if (res.status === 200) {
                setResults(res.data.data);
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                return addToast({
                    message: err.response?.data?.msg,
                    type: "error",
                });
            }
            console.error(err);
        }
    };

    const onOpenRatingModal = (
        restaurantName: string,
        restaurantId: number,
        foodItems: RestaurantResultType["foodItems"],
    ) => {
        console.log(restaurantName, restaurantId, foodItems);
        if (!isAuth) {
            return addToast({
                message: "Please login to add a rating",
                type: "error",
            });
        }
        setCurrentRestaurantName(restaurantName);
        setCurrentRestaurantId(restaurantId);
        setCurrentFoodItems(foodItems);
        setOpenRatingModal(true);
    };

    return (
        <>
            <div className="w-full py-32 flex flex-row justify-center items-start gap-8">
                <SearchRestaurantForm onSearch={onSearch} />
                <RestaurantResults
                    results={results}
                    onOpenRatingModal={onOpenRatingModal}
                />
            </div>
            <MultipleRatingModal
                open={openRatingModal}
                setOpen={setOpenRatingModal}
                restaurantId={currentRestaurantId}
                restaurantName={currentRestaurantName}
                foodItems={currentFoodItems}
                setOpenNewItemModal={setOpenNewItemModal}
            />
            <NewFoodItemModal
                open={openNewItemModal}
                setOpen={setOpenNewItemModal}
                restaurantId={currentRestaurantId}
                restaurantFoodItems={currentFoodItems}
            />
        </>
    );
};

export default AddRating;
