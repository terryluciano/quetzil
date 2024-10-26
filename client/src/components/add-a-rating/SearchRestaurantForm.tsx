import { createRef } from "react";
import { OnSearchFunction } from "../../views/AddRating";
import AuthFormWrapper from "../AuthFormWrapper";
import { InputField } from "../InputField";

interface SearchRestaurantFormProps {
    onSearch: OnSearchFunction;
}

const SearchRestaurantForm = ({
    onSearch,
}: SearchRestaurantFormProps): JSX.Element => {
    const restaurantNameRef = createRef<HTMLInputElement>();
    const stateRef = createRef<HTMLInputElement>();
    const cityRef = createRef<HTMLInputElement>();

    const handleSearch = () => {
        const name = restaurantNameRef.current?.value;
        const state = stateRef.current?.value;
        const city = cityRef.current?.value;

        onSearch({
            name,
            state,
            city,
        });
    };

    return (
        <AuthFormWrapper
            buttonText="Search"
            buttonProps={{
                onClick: handleSearch,
            }}
            headerTitle="Search for Restaurant"
        >
            <div className="flex flex-col gap-2 w-full px-8">
                <InputField
                    ref={restaurantNameRef}
                    placeholder="Restaurant Name"
                    divclassname="shadow-none"
                />
                <InputField
                    ref={stateRef}
                    placeholder="State"
                    divclassname="shadow-none"
                />
                <InputField
                    ref={cityRef}
                    placeholder="City"
                    divclassname="shadow-none"
                />
            </div>
        </AuthFormWrapper>
    );
};

export default SearchRestaurantForm;
