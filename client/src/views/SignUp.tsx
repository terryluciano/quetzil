import { Link, redirect } from 'react-router-dom';
import AuthFormWrapper from '../components/AuthFormWrapper';
import { createRef, HTMLProps, useState } from 'react';
import { InputField } from '../components/InputField';
import axios from 'axios';
import { API_URL } from '../utils/url';

const FormFooter = () => {
	return (
		<p className='text-base font-normal'>
			Already have an account?{' '}
			<Link
				to='/login'
				className='transition-all font-medium text-primary hover:text-primary-hover hover:underline'
			>
				Log in
			</Link>
		</p>
	);
};

const SignUp = () => {
	const emailRef = createRef<HTMLInputElement>();
	const passwordRef = createRef<HTMLInputElement>();
	const confirmPasswordRef = createRef<HTMLInputElement>();
	const firstNameRef = createRef<HTMLInputElement>();
	const lastNameRef = createRef<HTMLInputElement>();

	const [requestProcessing, setRequestProcessing] = useState(false);

	const onSignUp = () => {
		const email = emailRef.current?.value;
		const password = passwordRef.current?.value;
		const confirmPassword = confirmPasswordRef.current?.value;
		const firstName = firstNameRef.current?.value;
		const lastName = lastNameRef.current?.value;

		const data = {
			email,
			password,
			confirmPassword,
			firstName,
			lastName,
		};

		setRequestProcessing(true);

		axios
			.post(`${API_URL}/auth/signup`, data, {
				withCredentials: true,
			})
			.then((res) => {
				console.log(res);
				redirect('/logion');
			})
			.finally(() => {
				setRequestProcessing(false);
			});
	};

	const buttonProps: HTMLProps<HTMLButtonElement> = {
		disabled:
			emailRef.current?.value.length === 0 ||
			passwordRef.current?.value.length === 0 ||
			confirmPasswordRef.current?.value.length === 0 ||
			firstNameRef.current?.value.length === 0 ||
			lastNameRef.current?.value.length === 0 ||
			!requestProcessing,
		onClick: () => {
			onSignUp();
		},
	};

	return (
		<div className='flex-center pt-32 w-full'>
			<AuthFormWrapper
				headerTitle='Create an Account'
				formTitle='Welcome to Quetzil'
				formSubTitle='Want it. Find it. Eat it.'
				buttonText='Sign Up'
				buttonProps={buttonProps}
				footerChildren={<FormFooter />}
			>
				<div className='flex flex-col gap-2 w-full px-8'>
					<InputField
						ref={emailRef}
						placeholder='Email'
						divclassname='shadow-none'
					/>
					<InputField
						ref={passwordRef}
						placeholder='Password'
						divclassname='shadow-none'
					/>
					<InputField
						ref={confirmPasswordRef}
						placeholder='Confirm Password'
						divclassname='shadow-none'
					/>
					<InputField
						ref={firstNameRef}
						placeholder='First Name'
						divclassname='shadow-none'
					/>
					<InputField
						ref={lastNameRef}
						placeholder='Last Name'
						divclassname='shadow-none'
					/>
				</div>
			</AuthFormWrapper>
		</div>
	);
};

export default SignUp;
