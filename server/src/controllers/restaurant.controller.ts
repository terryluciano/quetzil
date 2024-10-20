import { Request, Response } from "express";
import { db } from "..";
import { cuisines, restaurantCuisines, restaurants } from "../schema";
import { createInsertSchema } from "drizzle-zod";
import { eq, and, exists, or } from "drizzle-orm";
import z from "zod";
import { ilike } from "drizzle-orm";
import { errorResponse } from "../utils/res.wrapper";
import { States } from "../utils/constants";
import { createSelectSchema } from "drizzle-zod";
import { sql } from "drizzle-orm";

const insertRestaurantSchema = createInsertSchema(restaurants, {
    name: (schema) =>
        schema.name.min(3, {
            message: "Restaurant Name must be at least 3 characters long'",
        }),
    website: (schema) => schema.website.url().optional(),
});

const insertRestaurantCuisineSchema = createInsertSchema(restaurantCuisines);

type RestaurantCuisineInsertType = z.infer<
    typeof insertRestaurantCuisineSchema
>;

const cuisineSchema = z.array(z.number());

const selectSearchRestaurantSchema = createSelectSchema(restaurants, {
    name: (schema) => schema.name.optional(),
    state: (schema) => schema.state.optional(),
    city: (schema) => schema.city.optional(),
}).pick({
    name: true,
    state: true,
    city: true,
});

// add restaurant
export const addRestaurantController = async (req: Request, res: Response) => {
    try {
        const { name, cuisines, website, address, city, state, zipCode } =
            req.body;

        const cuisineData = cuisineSchema.safeParse(cuisines);

        if (!cuisineData.success) {
            return res
                .status(400)
                .json(
                    errorResponse(
                        "You must provide at least one type of cuisine for the give restaurant",
                    ),
                );
        }

        const requestData = insertRestaurantSchema.safeParse({
            name,
            website: website == "" ? null : website,
            address,
            city,
            state,
            zipCode,
        });

        if (!requestData.success) {
            console.log(requestData.error);
            return res
                .status(400)
                .json(errorResponse(requestData.error.errors[0].message));
        }

        let acceptedState = false;

        for (const state of States) {
            if (
                state.name.toLowerCase() ===
                    requestData.data.state.toLowerCase() ||
                state.abbreviation.toLowerCase() ===
                    requestData.data.state.toLowerCase()
            ) {
                requestData.data.state = state.abbreviation.toUpperCase();
                acceptedState = true;
                break;
            }
        }

        if (!acceptedState) {
            return res.status(400).json(errorResponse("Invalid State"));
        }

        const existsCondition = db
            .select()
            .from(restaurants)
            .where(
                and(
                    eq(restaurants.address, requestData.data.address),
                    eq(restaurants.state, requestData.data.state),
                    eq(restaurants.city, requestData.data.city),
                    eq(restaurants.zipCode, requestData.data.zipCode),
                    eq(restaurants.name, requestData.data.name),
                ),
            );
        const existsQuery = await db
            .select()
            .from(restaurants)
            .where(exists(existsCondition));
        if (existsQuery.length > 0) {
            return res
                .status(409)
                .json(errorResponse("Restaurant already exists"));
        } else {
            const insertData = {
                ...requestData.data,
                website: requestData.data.website ?? null,
            };

            const insertQuery = await db
                .insert(restaurants)
                .values(insertData)
                .onConflictDoNothing()
                .returning();

            if (insertQuery.length > 0) {
                const insertResult = insertQuery[0];

                console.log(insertResult);

                const cuisineArray: RestaurantCuisineInsertType[] = [];

                cuisineData.data.forEach((id) => {
                    cuisineArray.push({
                        cuisineId: id,
                        restaurantId: insertResult.id,
                    });
                });

                await db.insert(restaurantCuisines).values(cuisineArray);

                return res
                    .status(200)
                    .json({ msg: "Successfully submitted Restaurant" });
            } else {
                return res
                    .status(500)
                    .json(
                        errorResponse(
                            "Internal Server Error while adding a new restaurant",
                        ),
                    );
            }
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json(errorResponse());
    }
};

// get restaurant search
export const getRestaurants = async (req: Request, res: Response) => {
    try {
        const { restaurant, state, city } = req.query;

        const requestData = selectSearchRestaurantSchema.safeParse({
            name: restaurant,
            state,
            city,
        });

        if (!requestData.success) {
            return res.status(200).json({ data: [] });
        } else {
            const searchQuery = await db
                .select({
                    id: restaurants.id,
                    name: restaurants.name,
                    address: restaurants.address,
                    state: restaurants.state,
                    city: restaurants.city,
                    zipCode: restaurants.zipCode,
                    website: restaurants.website,
                    cuisines: sql`ARRAY_AGG(json_build_object('id', cuisines.id, 'name', cuisines.name)) AS cuisines`,
                })
                .from(restaurants)
                .leftJoin(
                    restaurantCuisines,
                    eq(restaurantCuisines.restaurantId, restaurants.id),
                )
                .leftJoin(
                    cuisines,
                    eq(cuisines.id, restaurantCuisines.cuisineId),
                )
                .where(
                    or(
                        requestData.data.name != ""
                            ? ilike(
                                  restaurants.name,
                                  `%${requestData.data.name}%`,
                              )
                            : undefined,
                        and(
                            ilike(
                                restaurants.state,
                                `%${requestData.data.state}%`,
                            ),
                            ilike(
                                restaurants.city,
                                `%${requestData.data.city}%`,
                            ),
                        ),
                    ),
                )
                .groupBy(restaurants.id);

            return res.status(200).json({ data: searchQuery });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json(errorResponse());
    }
};

// get cuisines
export const getCuisines = async (req: Request, res: Response) => {
    try {
        const { search } = req.query;

        const searchSchema = z.string();

        const requestData = searchSchema.safeParse(search);

        if (!requestData.success) {
            return res.status(200).json({ data: [] });
        } else {
            const selectQuery = await db
                .select()
                .from(cuisines)
                .where(ilike(cuisines.name, `%${requestData.data}%`));

            return res.status(200).json({ data: selectQuery });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json(errorResponse());
    }
};