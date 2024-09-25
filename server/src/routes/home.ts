import { Router, Request, Response, NextFunction } from "express";
import { users } from "../schema";
import { db } from "..";
const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
    console.log(req.ip);
    return next();
});

router.get("/", async (req: Request, res: Response) => {
    try {
        const result = await db.select().from(users);
        console.log(result);
        console.log("User has come");
        res.status(400).json({ msg: "welcome" });
    } catch (e) {
        console.error(e);
        res.status(200).json({ error: true });
    }
});

export default router;
