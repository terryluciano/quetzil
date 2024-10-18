import { Request, Response } from "express";
import { db } from "..";
import { restaurants } from "../schema";
import z from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

const insertRestaurantSchema = createInsertSchema(restaurants, {
    name: (schema) =>
        schema.name.min(3, {
            message: "Restaurant Name must be at least 8 characters long'",
        }),
    cuisines: (schema) => schema.cuisines.min(1),
});

export const addRestaurantController = async (
    req: Request,
    res: Response,
) => {};
