import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useState,
} from 'react';

const AuthContext = createContext<{
	isAuth: boolean | null;
	setIsAuth: Dispatch<SetStateAction<boolean | null>>;
}>({
	isAuth: null,
	setIsAuth: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isAuth, setIsAuth] = useState<boolean | null>(null);

	return (
		<AuthContext.Provider value={{ isAuth, setIsAuth }}>
			{children}
		</AuthContext.Provider>
	);
};

export type Toast = {
	id: number;
	message: string;
	type: 'success' | 'error';
	duration?: number;
};

export const ToastContext = createContext<{
	toasts: Toast[];
	setToasts: Dispatch<SetStateAction<Toast[]>>;
	addToast: (toast: Pick<Toast, 'message' | 'type' | 'duration'>) => void;
}>({
	toasts: [],
	setToasts: () => {},
	addToast: () => {},
});

export const useToastContext = () => useContext(ToastContext);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const addToast = (toast: Pick<Toast, 'message' | 'type' | 'duration'>) => {
		const id = Math.floor(Math.random() * 1000000000);

		setToasts([
			{
				id,
				message: toast.message,
				type: toast.type,
				duration: toast.duration,
			},
		]);
	};

	return (
		<ToastContext.Provider
			value={{
				toasts,
				setToasts,
				addToast,
			}}>
			{children}
		</ToastContext.Provider>
	);
};
