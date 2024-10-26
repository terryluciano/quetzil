import { RestaurantResultType } from "../../views/AddRating";
import { useNavigate } from "react-router-dom";
import RestaurantCard from "./RestaurantCard";

interface RestaurantResultsProps {
    results: RestaurantResultType[];
    onOpenRatingModal: (
        restaurantName: string,
        restaurantId: number,
        foodItems: RestaurantResultType["foodItems"],
    ) => void;
}

const RestaurantResults = ({
    results,
    onOpenRatingModal,
}: RestaurantResultsProps) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-4 w-full max-w-[400px]">
            {/* Header */}
            <p className="font-Fira-Sans font-medium text-base">
                {results.length} Results
            </p>
            <div className="w-full h-px bg-text/50" />

            {/* Main Results */}
            {results.length == 0 ? (
                <>
                    <p className="font-Fira-Sans font-medium text-base">
                        No Results Found
                    </p>
                    <p className="font-Open-Sans text-xs font-normal text-text">
                        Would you like to submit a{" "}
                        <span
                            className="text-primary cursor-pointer"
                            onClick={() => navigate("/add-restaurant")}
                        >
                            New Restaurant?
                        </span>
                    </p>
                </>
            ) : (
                results.map((result) => (
                    <RestaurantCard
                        key={result.id}
                        restaurant={result}
                        onOpenRatingModal={onOpenRatingModal}
                    />
                ))
            )}
        </div>
    );
};

export default RestaurantResults;
