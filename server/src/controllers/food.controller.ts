import { and, eq, exists, ilike, or, sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { Request, Response } from "express";
import z from "zod";
import { db } from "..";
import {
    cuisines,
    foodItems,
    foodRatings,
    restaurantCuisines,
    restaurantFoodItems,
    restaurants,
} from "../schema";
import { errorResponse } from "../utils/res.wrapper";
import { avg } from "drizzle-orm";
import { desc } from "drizzle-orm";

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
            const restaurantFoodItemExistsQuery = await db
                .select()
                .from(restaurantFoodItems)
                .where(
                    exists(
                        db
                            .select()
                            .from(restaurantFoodItems)
                            .where(
                                and(
                                    eq(
                                        restaurantFoodItems.foodId,
                                        requestData.data.foodId,
                                    ),
                                    eq(
                                        restaurantFoodItems.restaurantId,
                                        requestData.data.restaurantId,
                                    ),
                                ),
                            ),
                    ),
                );

            if (restaurantFoodItemExistsQuery.length == 0) {
                return res
                    .status(404)
                    .json(
                        errorResponse(
                            "Restaurant does not offer this food item",
                        ),
                    );
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

// main search - POST
export const searchFoodItems = async (req: Request, res: Response) => {
    try {
        const { foodId, state, city, cuisinesArr } = req.body;

        const searchSchema = z.object({
            foodId: z.number(),
            state: z.string().optional(),
            city: z.string().optional(),
            cuisines: z.array(z.number()).optional(),
        });

        const requestData = searchSchema.safeParse({
            foodId,
            state,
            city,
            cuisines: cuisinesArr,
        });

        if (!requestData.success) {
            console.log(requestData.error.errors);
            return res
                .status(400)
                .json(errorResponse(requestData.error.errors[0].message));
        }

        const foodItemExistsQuery = await db
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

        if (foodItemExistsQuery.length == 0) {
            return res
                .status(404)
                .json(errorResponse("Food Item does not exisit"));
        }

        // TODO - cuisines array has duplicates, suggestion is to have the ratings pulled from a different query and combine it with the food item query

        // get the average rating for the food item
        // return the address, state, city, zip code, website, cuisines, rating (of the food item) from the restaurant
        const searchQuery = await db
            .select({
                restaurantId: restaurants.id,
                name: restaurants.name,
                address: restaurants.address,
                state: restaurants.state,
                city: restaurants.city,
                zipCode: restaurants.zipCode,
                website: restaurants.website,
                cuisines: sql`ARRAY_AGG(json_build_object('id', cuisines.id, 'name', cuisines.name)) AS cuisines`,
                rating: avg(foodRatings.rating),
            })
            .from(restaurants)
            .leftJoin(
                foodRatings,
                and(
                    eq(foodRatings.restaurantId, restaurants.id),
                    eq(foodRatings.foodId, requestData.data.foodId),
                ),
            )
            .leftJoin(
                restaurantCuisines,
                eq(restaurantCuisines.restaurantId, restaurants.id),
            )
            .leftJoin(cuisines, eq(cuisines.id, restaurantCuisines.cuisineId))
            .leftJoin(
                restaurantFoodItems,
                eq(restaurantFoodItems.restaurantId, restaurants.id),
            )
            .where(
                and(
                    eq(restaurantFoodItems.foodId, requestData.data.foodId),
                    requestData.data.state != undefined &&
                        requestData.data.state != "" &&
                        requestData.data.city != undefined &&
                        requestData.data.city != ""
                        ? and(
                              ilike(
                                  restaurants.state,
                                  `%${requestData.data.state}%`,
                              ),
                              ilike(
                                  restaurants.city,
                                  `%${requestData.data.city}%`,
                              ),
                          )
                        : or(
                              ilike(
                                  restaurants.state,
                                  `%${requestData.data.state}%`,
                              ),
                              ilike(
                                  restaurants.city,
                                  `%${requestData.data.city}%`,
                              ),
                          ),
                    requestData.data.cuisines &&
                        requestData.data.cuisines?.length > 0
                        ? or(
                              ...requestData.data.cuisines.map((cuisineId) =>
                                  eq(restaurantCuisines.cuisineId, cuisineId),
                              ),
                          )
                        : undefined,
                ),
            )
            .groupBy(restaurants.id)
            .orderBy(desc(avg(foodRatings.rating)));

        const filteredData = searchQuery as Array<{
            restaurantId: number;
            name: string;
            address: string;
            state: string;
            city: string;
            zipCode: number;
            website: string | null;
            cuisines: Array<{ id: number; name: string }>;
            rating: string | null;
        }>;

        // clean up the data - remove duplicate cuisines
        filteredData.forEach((restaurant) => {
            restaurant.cuisines = restaurant.cuisines.filter(
                (obj1, index, self) =>
                    index === self.findIndex((obj2) => obj2.id === obj1.id),
            );
        });

        return res.status(200).json({
            data: filteredData,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json(errorResponse());
    }
};

export const getFoodItems = async (req: Request, res: Response) => {
    try {
        const { search, all } = req.query;

        if (all == "true") {
            const selectQuery = await db.select().from(foodItems);

            return res.status(200).json({ data: selectQuery });
        } else {
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
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json(errorResponse());
    }
};
