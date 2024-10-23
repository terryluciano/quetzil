import { Router } from "express";
import {
    addFoodItem,
    addRestaurantController,
    getCuisines,
    getRestaurants,
} from "../controllers/restaurant.controller";
import { isLoggedIn } from "../controllers/auth.controller";

const router = Router();

router.post("/add", isLoggedIn, addRestaurantController);

router.post("/add-food-item", isLoggedIn, addFoodItem);

router.get("/cuisines", getCuisines);

router.get("/search", getRestaurants);

export default router;
