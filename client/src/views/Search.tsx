import SearchForm from "../components/search/SearchForm";

export type SubmitOptions = {
    state?: string;
    city?: string;
    food: string;
    cuisines?: (string | number)[];
};
export type OnSubmitFunction = (options: SubmitOptions) => Promise<void>;

const Search = () => {
    const onSubmit: OnSubmitFunction = async ({
        state,
        city,
        food,
        cuisines,
    }) => {
        console.log(state, city, food, cuisines);
    };

    return (
        <div className="mt-12 flex flex-col justify-start items-center gap-12">
            <SearchForm onSubmit={onSubmit} />
            <p>Search</p>
        </div>
    );
};

export default Search;
