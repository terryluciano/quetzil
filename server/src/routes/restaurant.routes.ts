import { Router } from "express";
import {
    addRestaurantController,
    getCuisines,
    getRestaurants,
} from "../controllers/restaurant.controller";
import { isLoggedIn } from "../controllers/auth.controller";

const router = Router();

router.post("/add", isLoggedIn, addRestaurantController);

router.get("/cuisines", getCuisines);

router.get("/search", getRestaurants);

export default router;
