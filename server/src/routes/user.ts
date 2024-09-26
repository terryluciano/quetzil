import { Router, Request, Response } from "express";
import { users } from "../schema";
import { db } from "..";
const router = Router();
import bcrypt from "bcrypt";
import { createInsertSchema } from "drizzle-zod";

const insertUserSchema = createInsertSchema(users, {
    password: (schema) =>
        schema.password
            .min(8, { message: "Password must be 8 characters long" })
            .max(32, {
                message: "Password must be no more than 32 characters long",
            }),
    username: (schema) =>
        schema.username
            .min(4, { message: "Password must be 4 characters long" })
            .max(32, {
                message: "Password must be no more than 32 characters long",
            }),
    email: (schema) => schema.email.email(),
});

// sign up
router.post("/signup", async (req: Request, res: Response) => {
    const { password, email, username, firstName, lastName } = req.body;

    const requestData = insertUserSchema.safeParse({
        username,
        password,
        email,
        firstName,
        lastName,
    });

    if (!requestData.success) {
        console.log(requestData.error.errors[0]);
        return res
            .status(400)
            .json({ msg: requestData.error.errors[0].message });
    }

    const hashed = await bcrypt.hash(password, 10);
    return res.status(200).json({ msg: "sign up" });
});

// login

// logout

export default router;
