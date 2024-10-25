import axios from "axios";
import SearchForm from "../components/search/SearchForm";
import { API_URL } from "../utils/url";
import { useContext, useMemo, useState } from "react";
import SearchResultsHeader from "../components/search/SearchResultsHeader";
import SearchResult from "../components/search/SearchResult";
import AddRatingModal from "../components/modals/AddRatingModal";
import { AuthContext, ToastContext } from "../Context";

export type SearchResultType = {
    restaurantId: number;
    name: string;
    address: string;
    state: string;
    city: string;
    zipCode: number;
    website: string | null;
    cuisines: Array<{ id: number; name: string }>;
    rating: string | number | null;
    hasRating?: boolean;
};

export type SubmitOptions = {
    state?: string;
    city?: string;
    foodId: number;
    foodName: string;
    cuisines?: (string | number)[];
};

export type OnSubmitFunction = (options: SubmitOptions) => Promise<void>;
export type HandleOpenRatingModalType = (
    restaurantId: number,
    restaurantName: string,
) => void;

const Search = () => {
    const { isAuth } = useContext(AuthContext);
    const { addToast } = useContext(ToastContext);

    const [results, setResults] = useState<SearchResultType[]>([]);
    const [sortBy, setSortBy] = useState<"desc" | "asc">("desc");
    const [currentFoodName, setCurrentFoodName] = useState<string | null>(null);
    const [currentFoodId, setCurrentFoodId] = useState<number | null>(null);
    const [currentRestaurantId, setCurrentRestaurantId] = useState<
        number | null
    >(null);
    const [currentRestaurantName, setCurrentRestaurantName] = useState<
        string | null
    >(null);

    const filterResults: SearchResultType[] = useMemo(() => {
        return results
            .map((result) => {
                return {
                    ...result,
                    hasRating: result.rating !== null,
                    rating: result.rating ? result.rating : 0,
                };
            })
            .sort((a, b) =>
                sortBy === "desc"
                    ? Number(b.rating) - Number(a.rating)
                    : Number(a.rating) - Number(b.rating),
            );
    }, [results, sortBy]);

    const numberOffResults = useMemo(() => {
        return filterResults.length;
    }, [filterResults]);

    const onSubmit: OnSubmitFunction = async ({
        state,
        city,
        foodId,
        foodName,
        cuisines,
    }) => {
        try {
            const res = await axios.post(
                `${API_URL}/food/search`,
                {
                    foodId,
                    state,
                    city,
                    cuisinesArr: cuisines,
                },
                {
                    withCredentials: true,
                },
            );
            if (res.status === 200) {
                setResults(res.data.data);
                setSortBy("desc");
                setCurrentFoodName(foodName);
                setCurrentFoodId(foodId);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const [openRatingModal, setOpenRatingModal] = useState(false);

    const handleOpenRatingModal: HandleOpenRatingModalType = (
        restaurantId: number,
        restaurantName: string,
    ) => {
        if (!isAuth) {
            return addToast({
                message: "Please login to add a rating",
                type: "error",
            });
        }
        setCurrentRestaurantId(restaurantId);
        setCurrentRestaurantName(restaurantName);
        setOpenRatingModal(true);
    };

    return (
        <>
            <div className="my-12 flex flex-col justify-start items-center gap-12 w-full max-w-[1080px]">
                <SearchForm onSubmit={onSubmit} />

                <SearchResultsHeader
                    numberOfResults={numberOffResults}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                />
                <div className="flex flex-col gap-3 w-full">
                    {filterResults.map((result) => (
                        <SearchResult
                            key={result.restaurantId}
                            handleOpenRatingModal={handleOpenRatingModal}
                            {...result}
                        />
                    ))}
                </div>
            </div>
            <AddRatingModal
                open={openRatingModal}
                setOpen={setOpenRatingModal}
                restaurantId={currentRestaurantId}
                restaurantName={currentRestaurantName}
                foodId={currentFoodId}
                foodName={currentFoodName}
            />
        </>
    );
};

export default Search;
