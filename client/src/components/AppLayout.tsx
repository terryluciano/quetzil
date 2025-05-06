import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

import Toaster from './Toaster';

const AppLayout = () => {
	return (
		<div className='relative w-full h-full flex flex-col gap-0 items-center justify-start text-text bg-bg font-Open-Sans'>
			<NavBar />
			<Toaster />
			<Outlet />
		</div>
	);
};

export default AppLayout;
