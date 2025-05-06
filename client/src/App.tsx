import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout.tsx';
import { API_URL } from './utils/url';
import axios from 'axios';
import {
	useAuthContext,
	useToastContext,
} from './components/utils/Context.tsx';

const AddRating = lazy(() => import('./views/add-rating/AddRating.tsx'));
const AddRestaurant = lazy(
	() => import('./views/add-restaurant/AddRestaurant.tsx')
);
const Home = lazy(() => import('./views/home/Home.tsx'));
const Login = lazy(() => import('./views/login/Login.tsx'));
const Logout = lazy(() => import('./views/logout/Logout.tsx'));
const Search = lazy(() => import('./views/search/Search.tsx'));
const SignUp = lazy(() => import('./views/signup/SignUp.tsx'));

function App() {
	const { setIsAuth } = useAuthContext();
	const { addToast } = useToastContext();

	const getAuthStatus = async () => {
		try {
			const res = await axios.get(`${API_URL}/auth/status`, {
				withCredentials: true,
			});
			if (res.status === 200) {
				if (res.data.status) {
					setIsAuth(true);
				} else {
					setIsAuth(false);
				}
			} else {
				setIsAuth(false);
			}
		} catch (err) {
			setIsAuth(false);
			if (axios.isAxiosError(err)) {
				return addToast({
					message: err.response?.data?.msg,
					type: 'error',
				});
			}
			console.error(err);
		}
	};

	useEffect(() => {
		getAuthStatus();

		return () => {
			setIsAuth(false);
		};
	}, []);

	return (
		<BrowserRouter>
			<Suspense
				fallback={
					<div className='w-full h-full flex-center'>
						<p>Loading...</p>
					</div>
				}>
				<Routes>
					<Route path='/' element={<AppLayout />}>
						<Route path='/' element={<Home />} />
						<Route path='/login' element={<Login />} />
						<Route path='/logout' element={<Logout />} />
						<Route path='/sign-up' element={<SignUp />} />
						<Route path='/add-rating' element={<AddRating />} />
						<Route path='/search' element={<Search />} />
						<Route
							path='/add-restaurant'
							element={<AddRestaurant />}
						/>
					</Route>
					<Route path='/*' element={<h1>404</h1>} />
				</Routes>
			</Suspense>
		</BrowserRouter>
	);
}

export default App;
