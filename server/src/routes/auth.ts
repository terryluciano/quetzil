import { NextFunction, Request, Response, Router } from 'express';
const router = Router();

import {
	loginController,
	logoutController,
	signUpController,
	statusController,
} from '../controllers/auth';

router.use((req: Request, res: Response, next: NextFunction) => {
	console.log(`Path: ${req.path} | User: ${req.session.user?.id}`);
	next();
});

// sign up
router.post('/signup', signUpController);

// login
router.post('/login', loginController);

// logout
router.post('/logout', logoutController);

// status
router.get('/status', statusController);

export default router;
