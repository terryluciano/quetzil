import { Request, Response } from "express";
import { db } from "..";
import { restaurantCuisines, restaurants } from "../schema";
import { createInsertSchema } from "drizzle-zod";
import { eq, and, exists } from "drizzle-orm";
import z from "zod";

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

export const addRestaurantController = async (req: Request, res: Response) => {
    try {
        const { name, cuisines, website, address, city, state, zipCode } =
            req.body;

        const cuisineData = cuisineSchema.safeParse(cuisines);

        if (!cuisineData.success) {
            return res.status(400).json({
                msg: "You must provide at least one type of cuisine for the give restaurant",
                error: true,
            });
        }

        const requestData = insertRestaurantSchema.safeParse({
            name,
            website,
            address,
            city,
            state,
            zipCode,
        });

        if (!requestData.success) {
            return res.status(400).json({
                msg: requestData.error.errors[0].message,
                error: true,
            });
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
            return res.status(409).json({
                msg: "Restaurant already exists",
                error: true,
            });
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
                return res.status(500).json({
                    msg: "Internal Server Error while adding a new restaurant",
                    error: true,
                });
            }
        }
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ msg: "Internal Server Error", error: true });
    }
};
