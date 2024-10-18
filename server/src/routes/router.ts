import { Router, Request, Response, NextFunction } from "express";
import homeRoutes from "./home.routes";
import userRoutes from "./auth.routes";
import restaurantRoutes from "./restaurant.routes";
import foodRoutes from "./food.routes";

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(
            `Path: ${req.path} | User ID: ${req.session.user?.id} | User Email: ${req.session.user?.email}`,
        );
        return next();
    } catch (err) {
        console.log(`Error occurred while logging user's request: ${err}`);
        return next();
    }
});

router.use("/", homeRoutes);
router.use("/auth", userRoutes);
router.use("/restaurant", restaurantRoutes);
router.use("/food", foodRoutes);

export default router;
