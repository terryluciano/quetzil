import { Link } from "react-router-dom";
import AuthFormWrapper from "../components/AuthFormWrapper";
import { HTMLAttributes } from "react";
import { InputField } from "../components/InputField";

const FormFooter = () => {
    return (
        <p className="text-base font-normal">
            New to Quetzil?{" "}
            <Link
                to="/sign-up"
                className="transition-all font-medium text-primary hover:text-primary-hover hover:underline"
            >
                Sign up
            </Link>
        </p>
    );
};

const Login = () => {
    const buttonProps: HTMLAttributes<HTMLButtonElement> = {
        onClick: () => {
            console.log("clicked");
        },
    };

    return (
        <div className="flex-center pt-32 w-full">
            <AuthFormWrapper
                headerTitle="Login"
                formTitle="Welcome Back"
                buttonText="Login"
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
                </div>
            </AuthFormWrapper>
        </div>
    );
};

export default Login;
