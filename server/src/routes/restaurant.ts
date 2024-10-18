import { Router } from "express";
import { addRestaurantController } from "../controllers/restaurant";

const router = Router();

router.post("/add", addRestaurantController);

export default router;
