import { Router } from "express";
import homeRoutes from "./home";
import userRoutes from "./user";

const router = Router();
router.use("/", homeRoutes);
router.use("/user", userRoutes);

export default router;
