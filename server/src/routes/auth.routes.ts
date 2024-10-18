import { NextFunction, Request, Response, Router } from "express";
const router = Router();

import {
    loginController,
    logoutController,
    signUpController,
    statusController,
} from "../controllers/auth.controller";

// sign up
router.post("/signup", signUpController);

// login
router.post("/login", loginController);

// logout
router.post("/logout", logoutController);

// status
router.get("/status", statusController);

export default router;
