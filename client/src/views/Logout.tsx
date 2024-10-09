import { useContext, useEffect } from 'react';
import { AuthContext } from '../Context';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/url';
import axios from 'axios';

const Logout = () => {
	const navigate = useNavigate();

	const { isAuth, setIsAuth } = useContext(AuthContext);

	const logout = async () => {
		try {
			const res = await axios.post(
				`${API_URL}/auth/logout`,
				{},
				{
					withCredentials: true,
				}
			);
			if (res.status === 200) {
				setIsAuth(false);
			} else {
				console.log('Logout failed');
			}
		} catch (e) {
			console.error(e);
		} finally {
			navigate('/');
		}
	};

	useEffect(() => {
		if (!isAuth) {
			navigate('/');
		} else {
			logout();
		}
	}, []);

	return <div>Logout</div>;
};

export default Logout;
