import { Link } from "react-router-dom";
import AuthFormWrapper from "../components/AuthFormWrapper";
import { createRef, HTMLAttributes } from "react";
import { InputField } from "../components/InputField";
import axios from "axios";
import { API_URL } from "../utils/url";
import { useContext } from "react";
import { AuthContext } from "../Context";

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
    const { isAuth, setIsAuth } = useContext(AuthContext);

    const emailRef = createRef<HTMLInputElement>();
    const passwordRef = createRef<HTMLInputElement>();

    const login = async () => {
        try {
            if (!isAuth) {
                const email = emailRef.current?.value;
                const password = passwordRef.current?.value;
                if (!email || !password) {
                    return;
                }

                const res = await axios.post(
                    `${API_URL}/auth/login`,
                    {
                        email,
                        password,
                    },
                    {
                        withCredentials: true,
                    },
                );

                if (res.status === 200) {
                    console.log(res.data);
                    setIsAuth(true);
                }
            } else {
                return console.log("already logged in");
            }
        } catch (e) {
            console.error(e);
        }
    };

    const buttonProps: HTMLAttributes<HTMLButtonElement> = {
        onClick: login,
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
                        ref={emailRef}
                    />
                    <InputField
                        ref={passwordRef}
                        placeholder="Password"
                        divclassname="shadow-none"
                    />
                </div>
            </AuthFormWrapper>
        </div>
    );
};

export default Login;
