import { Request, Response } from "express";
import { users } from "../schema";
import { db } from "..";
import bcrypt from "bcrypt";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { eq } from "drizzle-orm";
import { exists } from "drizzle-orm";
import z from "zod";

const insertUserSchema = createInsertSchema(users, {
    password: (schema) =>
        schema.password
            .min(8, { message: "Password must be 8 characters long" })
            .max(32, {
                message: "Password must be no more than 32 characters long",
            }),
    email: (schema) => schema.email.email(),
});

type UserInsertType = z.infer<typeof insertUserSchema>;

const selectUserSchema = createSelectSchema(users).pick({
    password: true,
    email: true,
});

export const signUpController = async (req: Request, res: Response) => {
    try {
        const { password, email, firstName, lastName } = req.body;

        const requestData = insertUserSchema.safeParse({
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

        const existQuery = db
            .select()
            .from(users)
            .where(eq(users.email, requestData.data.email));
        const existsResult = await db
            .select()
            .from(users)
            .where(exists(existQuery));

        if (existsResult.length > 0) {
            if (existsResult[0].email == requestData.data.email) {
                return res
                    .status(409)
                    .json({ msg: "Email is already used", error: true });
            } else {
                return res
                    .status(409)
                    .json({ msg: "User already exists", error: true });
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const insertData: UserInsertType = {
                ...requestData.data,
                password: hashedPassword,
            };
            const insertQuery = await db.insert(users).values(insertData);

            console.log(insertQuery);
            return res.status(200).json({ msg: "Sign up successful" });
        }
    } catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ msg: "Internal Server Error", error: true });
    }
};

export const loginController = async (req: Request, res: Response) => {
    try {
        if (req.session.user) {
            return res.status(200).json({ msg: "User is logged in" });
        }

        const { email, password } = req.body;

        const requestData = selectUserSchema.safeParse({
            email,
            password,
        });

        if (!requestData.success) {
            console.log(requestData.error);
            return res
                .status(400)
                .json({ msg: requestData.error.errors[0].message });
        }

        const selectQuery = await db
            .select()
            .from(users)
            .where(eq(users.email, requestData.data.email));

        if (selectQuery.length == 0) {
            return res
                .status(404)
                .json({ msg: "User does not exists", error: true });
        }

        const comparePassword = await bcrypt.compare(
            requestData.data.password,
            selectQuery[0].password,
        );

        if (!comparePassword) {
            return res
                .status(401)
                .json({ msg: "Incorrect Password", error: true });
        }

        const userData = selectQuery[0];
        req.session.user = {
            id: userData.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
        };

        return res.status(200).json({ msg: "Login Successful" });
    } catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ msg: "Internal Server Error", error: true });
    }
};

export const logoutController = async (req: Request, res: Response) => {
    try {
        if (req.session.user) {
            req.session.destroy((err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        msg: "Failed to logout, please try again",
                        error: true,
                    });
                }
                return res.status(200).json({ msg: "Logout Successful" });
            });
        } else {
            return res
                .status(400)
                .json({ msg: "You are not logged in", error: true });
        }
    } catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ msg: "Internal Server Error", error: true });
    }
};
