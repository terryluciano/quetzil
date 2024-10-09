import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { AuthContext } from './Context.ts';

import Home from './views/Home.tsx';
import AppLayout from './components/AppLayout.tsx';
import Login from './views/Login.tsx';
import SignUp from './views/SignUp.tsx';
import AddRating from './views/AddRating.tsx';
import Search from './views/Search.tsx';
import Logout from './views/Logout.tsx';
import { API_URL } from './utils/url.ts';
import axios from 'axios';

function App() {
	const navigate = useNavigate();
	const [isAuth, setIsAuth] = useState<boolean | null>(null);

	const getAuthStatus = async () => {
		const res = await axios.get(`${API_URL}/auth/status`, {
			withCredentials: true,
		});
		if (res.status === 200) {
			setIsAuth(true);
			navigate('/');
		} else {
			setIsAuth(false);
		}
	};

	useEffect(() => {
		getAuthStatus();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				isAuth,
				setIsAuth,
			}}
		>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<AppLayout />}>
						<Route path='/' element={<Home />} />
						<Route path='/login' element={<Login />} />
						<Route path='/logout' element={<Logout />} />
						<Route path='/sign-up' element={<SignUp />} />
						<Route path='/add-rating' element={<AddRating />} />
						<Route path='/search' element={<Search />} />
					</Route>
					<Route path='/*' element={<h1>404</h1>} />
				</Routes>
			</BrowserRouter>
		</AuthContext.Provider>
	);
}

export default App;
