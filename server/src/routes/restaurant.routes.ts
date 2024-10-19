import { Router } from "express";
import {
    addRestaurantController,
    getCuisines,
} from "../controllers/restaurant.controller";
import { isLoggedIn } from "../controllers/auth.controller";

const router = Router();

router.post("/add", isLoggedIn, addRestaurantController);

router.get("/cuisines", getCuisines);

export default router;
