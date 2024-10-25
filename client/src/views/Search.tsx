import axios from "axios";
import SearchForm from "../components/search/SearchForm";
import { API_URL } from "../utils/url";
import { useMemo, useState } from "react";
import SearchResultsHeader from "../components/search/SearchResultsHeader";
import SearchResult from "../components/search/SearchResult";

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
    cuisines?: (string | number)[];
};
export type OnSubmitFunction = (options: SubmitOptions) => Promise<void>;

const Search = () => {
    const [results, setResults] = useState<SearchResultType[]>([]);
    const [sortBy, setSortBy] = useState<"desc" | "asc">("desc");

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
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="my-12 flex flex-col justify-start items-center gap-12 w-full max-w-[1080px]">
            <SearchForm onSubmit={onSubmit} />

            <SearchResultsHeader
                numberOfResults={numberOffResults}
                sortBy={sortBy}
                setSortBy={setSortBy}
            />
            <div className="flex flex-col gap-3 w-full">
                {filterResults.map((result) => (
                    <SearchResult key={result.restaurantId} {...result} />
                ))}
            </div>
        </div>
    );
};

export default Search;
