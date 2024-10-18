import { Router } from "express";
import { isLoggedIn } from "../controllers/auth.controller";
import { addFoodRating } from "../controllers/food.controller";

const router = Router();

router.use(isLoggedIn);

router.post("/add-rating", addFoodRating);

export default router;
