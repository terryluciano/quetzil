import { eq, exists, ilike } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { Request, Response } from "express";
import z from "zod";
import { db } from "..";
import { foodItems, foodRatings, restaurants } from "../schema";
import { errorResponse } from "../utils/res.wrapper";

const insertFoodRatingSchema = createInsertSchema(foodRatings, {
    rating: (schema) =>
        schema.rating
            .gte(0, { message: "Rating must be greater than or equal to 0" })
            .lte(10, { message: "Rating must be less than or equal to 10" }),
});

// add food rating
export const addFoodRating = async (req: Request, res: Response) => {
    try {
        const { foodId, restaurantId, rating } = req.body;

        const requestData = insertFoodRatingSchema.safeParse({
            foodId,
            restaurantId,
            rating,
            userId: req.session.user?.id,
        });

        if (!requestData.success) {
            return res
                .status(400)
                .json(errorResponse(requestData.error.errors[0].message));
        } else {
            // check if food item exists
            const foodExistsQuery = await db
                .select()
                .from(foodItems)
                .where(
                    exists(
                        db
                            .select()
                            .from(foodItems)
                            .where(eq(foodItems.id, requestData.data.foodId)),
                    ),
                );

            if (foodExistsQuery.length == 0) {
                return res
                    .status(404)
                    .json(errorResponse("Food Item does not exisit"));
            }

            // check if restaurant exists
            const restaurantExistsQuery = await db
                .select()
                .from(restaurants)
                .where(
                    exists(
                        db
                            .select()
                            .from(restaurants)
                            .where(
                                eq(
                                    restaurants.id,
                                    requestData.data.restaurantId,
                                ),
                            ),
                    ),
                );

            if (restaurantExistsQuery.length == 0) {
                return res
                    .status(404)
                    .json(errorResponse("Restaurant does not exisit"));
            }

            // insert
            await db
                .insert(foodRatings)
                .values(requestData.data)
                .onConflictDoUpdate({
                    target: [
                        foodRatings.userId,
                        foodRatings.foodId,
                        foodRatings.restaurantId,
                    ],
                    set: { rating: requestData.data.rating },
                });

            return res
                .status(200)
                .json({ msg: "Successfully upsert food rating" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json(errorResponse());
    }
};

export const getFoodItems = async (req: Request, res: Response) => {
    try {
        const { search } = req.query;

        const searchSchema = z.string();

        const requestData = searchSchema.safeParse(search);

        if (!requestData.success) {
            return res.status(200).json({ data: [] });
        } else {
            const selectQuery = await db
                .select()
                .from(foodItems)
                .where(ilike(foodItems.name, `%${requestData.data}%`));

            return res.status(200).json({ data: selectQuery });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json(errorResponse());
    }
};
