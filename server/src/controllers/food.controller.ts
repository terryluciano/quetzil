import { Request, Response } from "express";
import { db } from "..";
import { foodRatings, foodItems, restaurants } from "../schema";
import { createInsertSchema } from "drizzle-zod";
import { exists, eq, and } from "drizzle-orm";

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
            return res.status(400).json({
                msg: requestData.error.errors[0].message,
                error: true,
            });
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
                    .json({ msg: "Food Item does not exisit" });
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
                    .json({ msg: "Restaurant does not exisit" });
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
        return res
            .status(500)
            .json({ msg: "Internal Server Error", error: true });
    }
};
