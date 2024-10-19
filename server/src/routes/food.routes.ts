import { Router } from "express";
import { isLoggedIn } from "../controllers/auth.controller";
import { addFoodRating, getFoodItems } from "../controllers/food.controller";

const router = Router();

router.post("/add-rating", isLoggedIn, addFoodRating);

router.get("/items", getFoodItems);

export default router;
