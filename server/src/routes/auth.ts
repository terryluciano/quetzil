import { Router } from "express";
const router = Router();

import {
    loginController,
    logoutController,
    signUpController,
} from "../controllers/auth";

// sign up
router.post("/signup", signUpController);

// login
router.post("/login", loginController);

// logout
router.post("/logout", logoutController);

export default router;
