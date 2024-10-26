import { RestaurantResultType } from "../../views/AddRating";

interface RestaurantCardProps {
    restaurant: RestaurantResultType;
    onOpenRatingModal: (
        restaurantName: string,
        restaurantId: number,
        foodItems: RestaurantResultType["foodItems"],
    ) => void;
}

const RestaurantCard = ({
    restaurant,
    onOpenRatingModal,
}: RestaurantCardProps) => {
    return (
        <div className="flex flex-col justify-between items-start border-text border-solid border-1 p-4 rounded-lg w-full max-w-[400px] h-[200px]">
            <div className="flex flex-col justify-start items-start text-text gap-1">
                <p className="text-2xl font-medium font-Fira-Sans">
                    {restaurant.name}
                </p>
                <p className="text-base font-semibold font-Open-Sans">
                    {restaurant.foodItems?.length || 0} Food Items
                </p>
                <div className="flex flex-row gap-1 items-center">
                    {restaurant.cuisines &&
                        restaurant.cuisines.map((cuisine, i) => (
                            <div
                                key={i}
                                className="flex flex-row gap-1 items-center"
                            >
                                <p>{cuisine.name}</p>
                                {i !== restaurant.cuisines.length - 1 && (
                                    <div className="bg-text/50 h-4 w-px" />
                                )}
                            </div>
                        ))}
                </div>
                <p>
                    {restaurant.address}, {restaurant.city}, {restaurant.state},{" "}
                    {restaurant.zipCode}
                </p>
            </div>
            <p
                className="text-text text-xs font-normal cursor-pointer"
                onClick={() => {
                    onOpenRatingModal(
                        restaurant.name,
                        restaurant.id,
                        restaurant.foodItems,
                    );
                }}
            >
                View Food Items &gt;
            </p>
        </div>
    );
};

export default RestaurantCard;
