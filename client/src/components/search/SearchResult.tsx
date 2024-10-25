import { SearchResultType } from "../../views/Search";

const SearchResult = ({
    restaurantId,
    name,
    address,
    state,
    city,
    zipCode,
    cuisines,
    rating,
    hasRating,
}: SearchResultType) => {
    return (
        <div className="flex flex-row w-full justify-between items-center border-text border-solid border-1 p-4 rounded-lg">
            <div className="flex flex-col justify-start items-start text-text gap-2">
                <div className="flex flex-col gap-0">
                    <p className="text-2xl font-medium font-Fira-Sans">
                        {name}
                    </p>
                    <div className="flex flex-row gap-1 items-center">
                        {cuisines &&
                            cuisines.map((cuisine, i) => (
                                <div
                                    key={i}
                                    className="flex flex-row gap-1 items-center"
                                >
                                    <p>{cuisine.name}</p>
                                    {i !== cuisines.length - 1 && (
                                        <div className="bg-text/50 h-4 w-px" />
                                    )}
                                </div>
                            ))}
                    </div>
                </div>
                <p>
                    {address}, {city}, {state}, {zipCode}
                </p>
                <p className="text-placeholder-text text-xs font-normal cursor-pointer">
                    Add a Rating &gt;
                </p>
            </div>
            <div className="bg-primary rounded-lg size-24 flex-center cursor-pointer">
                <div
                    className={`font-semibold font-Fira-Sans text-center ${hasRating ? "text-4xl" : "text-xl text-wrap"}`}
                >
                    {hasRating ? (
                        <p>{Number(rating).toFixed(1)}</p>
                    ) : (
                        <>
                            <p className="leading-none">No</p>
                            <p className="leading-none">Rating</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchResult;
