import { Link } from "react-router-dom";
import AuthFormWrapper from "../components/AuthFormWrapper";
import { HTMLAttributes } from "react";
import { InputField } from "../components/InputField";

const FormFooter = () => {
    return (
        <p className="text-base font-normal">
            Already have an account?{" "}
            <Link
                to="/login"
                className="transition-all font-medium text-primary hover:text-primary-hover hover:underline"
            >
                Log in
            </Link>
        </p>
    );
};

const SignUp = () => {
    const buttonProps: HTMLAttributes<HTMLButtonElement> = {
        onClick: () => {
            console.log("clicked");
        },
    };

    return (
        <div className="flex-center pt-32 w-full">
            <AuthFormWrapper
                headerTitle="Create an Account"
                formTitle="Welcome to Quetzil"
                formSubTitle="Want it. Find it. Eat it."
                buttonText="Sign Up"
                buttonProps={buttonProps}
                footerChildren={<FormFooter />}
            >
                <div className="flex flex-col gap-2 w-full px-8">
                    <InputField
                        placeholder="Email"
                        divclassname="shadow-none"
                    />
                    <InputField
                        placeholder="Password"
                        divclassname="shadow-none"
                    />
                    <InputField
                        placeholder="Confirm Password"
                        divclassname="shadow-none"
                    />
                    <InputField
                        placeholder="First Name"
                        divclassname="shadow-none"
                    />
                    <InputField
                        placeholder="Last Name"
                        divclassname="shadow-none"
                    />
                </div>
            </AuthFormWrapper>
        </div>
    );
};

export default SignUp;
