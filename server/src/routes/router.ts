import { Router } from "express";
import homeRoutes from "./home";
import userRoutes from "./auth";
import restaurantRoutes from "./restaurant";

const router = Router();
router.use("/", homeRoutes);
router.use("/auth", userRoutes);
router.use("/restaurant", restaurantRoutes);

export default router;
