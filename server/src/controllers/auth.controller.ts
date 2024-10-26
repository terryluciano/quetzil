import { NextFunction, Request, Response } from "express";
import { users } from "../schema";
import { db } from "..";
import bcrypt from "bcrypt";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { eq, or } from "drizzle-orm";
import { exists } from "drizzle-orm";
import z from "zod";
import { errorResponse } from "../utils/res.wrapper";

const insertUserSchema = createInsertSchema(users, {
    password: (schema) =>
        schema.password
            .min(8, { message: "Password must be at least 8 characters long" })
            .max(32, {
                message: "Password must be no more than 32 characters long",
            }),
    email: (schema) => schema.email.email(),
});

type UserInsertType = z.infer<typeof insertUserSchema>;

const selectUserSchema = createSelectSchema(users, {
    email: (schema) => schema.email.email(),
}).pick({
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
            return res
                .status(400)
                .json(errorResponse(requestData.error.errors[0].message));
        }

        const existsCondition = db
            .select()
            .from(users)
            .where(eq(users.email, requestData.data.email));
        const existsQuery = await db
            .select()
            .from(users)
            .where(exists(existsCondition));

        if (existsQuery.length > 0) {
            return res.status(409).json(errorResponse("Email is already used"));
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const insertData: UserInsertType = {
                ...requestData.data,
                password: hashedPassword,
            };
            await db.insert(users).values(insertData);
            return res.status(200).json({ msg: "Sign up successful" });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json(errorResponse());
    }
};

export const loginController = async (req: Request, res: Response) => {
    try {
        if (req.session.user) {
            return res.status(200).json({ msg: "User is already logged in" });
        }

        const { email, password } = req.body;

        const requestData = selectUserSchema.safeParse({
            email,
            password,
        });

        if (!requestData.success) {
            return res
                .status(400)
                .json(errorResponse(requestData.error.errors[0].message));
        }

        const selectQuery = await db
            .select()
            .from(users)
            .where(eq(users.email, requestData.data.email));

        if (selectQuery.length == 0) {
            return res.status(404).json(errorResponse("User does not exists"));
        }

        const comparePassword = await bcrypt.compare(
            requestData.data.password,
            selectQuery[0].password,
        );

        if (!comparePassword) {
            return res.status(401).json(errorResponse("Incorrect Password"));
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
        return res.status(500).json(errorResponse());
    }
};

export const logoutController = async (req: Request, res: Response) => {
    try {
        if (req.session.user) {
            req.session.destroy((err) => {
                if (err) {
                    console.error(err);
                    return res
                        .status(500)
                        .json(
                            errorResponse("Failed to logout, please try again"),
                        );
                }
                return res.status(200).json({ msg: "Logout Successful" });
            });
        } else {
            return res.status(400).json(errorResponse("You are not logged in"));
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json(errorResponse());
    }
};

export const statusController = async (req: Request, res: Response) => {
    try {
        if (req.session.user) {
            return res
                .status(200)
                .json({ msg: "User is logged in", status: true });
        } else {
            return res.status(401).json(errorResponse("User is not logged in"));
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json(errorResponse());
    }
};

export const isLoggedIn = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.session.user) {
            return res.status(401).json(errorResponse("User is not logged in"));
        } else {
            return next();
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json(errorResponse());
    }
};
