import { Router } from "express";
import { addRestaurantController } from "../controllers/restaurant.controller";
import { isLoggedIn } from "../controllers/auth.controller";

const router = Router();

router.use(isLoggedIn);

router.post("/add", addRestaurantController);

export default router;
