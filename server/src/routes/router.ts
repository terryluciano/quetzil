import { Router } from "express";
import homeRoutes from "./home";
import userRoutes from "./auth";

const router = Router();
router.use("/", homeRoutes);
router.use("/auth", userRoutes);

export default router;
