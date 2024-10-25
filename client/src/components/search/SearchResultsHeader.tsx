import { Dispatch, SetStateAction } from "react";
import sortIconSVG from "../../assets/icons/sort-icon.svg";

interface SearchResultsHeaderProps {
    numberOfResults: number;
    sortBy: "desc" | "asc";
    setSortBy: Dispatch<SetStateAction<"desc" | "asc">>;
}

const SearchResultsHeader = (props: SearchResultsHeaderProps) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            <div className="flex flex-row gap-2 justify-between items-center">
                <p className="text-placeholder-text text-base">
                    {props.numberOfResults} Results
                </p>
                <div
                    className="flex flex-row gap-1.5 items-center cursor-pointer"
                    onClick={() =>
                        props.setSortBy((prev) =>
                            prev === "asc" ? "desc" : "asc",
                        )
                    }
                >
                    <p className="select-none">
                        {props.sortBy === "desc" ? "Descending" : "Ascending"}
                    </p>
                    <img
                        className={`size-6 ${props.sortBy === "asc" ? "rotate-180" : ""}`}
                        src={sortIconSVG}
                    />
                </div>
            </div>
            <div className="bg-text w-full h-px" />
        </div>
    );
};

export default SearchResultsHeader;
