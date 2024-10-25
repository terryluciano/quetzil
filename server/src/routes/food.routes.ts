import { Router } from "express";
import { isLoggedIn } from "../controllers/auth.controller";
import {
    addFoodRating,
    getFoodItems,
    searchFoodItems,
} from "../controllers/food.controller";

const router = Router();

router.post("/add-rating", isLoggedIn, addFoodRating);

router.post("/search", searchFoodItems);

router.get("/items", getFoodItems);

export default router;
