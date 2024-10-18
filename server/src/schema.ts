import { sql, relations } from "drizzle-orm";
import { json, uniqueIndex } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { serial, text, integer } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    email: text("email").unique().notNull(),
    password: text("passowrd").notNull(),
    firstName: text("first_name"),
    lastName: text("last_name"),
});

export const usersRelations = relations(users, ({ many }) => ({
    foodRatings: many(foodRatings),
}));

export const foodItems = pgTable("food_items", {
    id: serial("id").primaryKey(),
    name: text("name").notNull().unique(),
});

export const foodItemsRelations = relations(foodItems, ({ many }) => ({
    foodRatings: many(foodRatings),
}));

export const restaurants = pgTable("restaurants", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    address: text("address").notNull(),
    state: text("state").notNull(),
    city: text("city").notNull(),
    zipCode: integer("zip_code").notNull(),
    website: text("website"),
});

export const restaurantsRelations = relations(restaurants, ({ many }) => ({
    foodRatings: many(foodRatings),
    foodItems: many(restaurantFoodItems),
    cuisines: many(restaurantCuisines),
}));

export const foodRatings = pgTable(
    "food_ratings",
    {
        id: serial("id").primaryKey(),
        foodId: integer("food_id")
            .notNull()
            .references(() => foodItems.id),
        restaurantId: integer("restaurant_id")
            .notNull()
            .references(() => restaurants.id),
        userId: integer("user_id")
            .notNull()
            .references(() => users.id),
        rating: integer("rating").notNull(),
    },
    (table) => {
        return {
            uniqueUserFoodRestaurant: uniqueIndex(
                "unique_user_food_restaurant",
            ).on(table.userId, table.foodId, table.restaurantId),
        };
    },
);

export const foodRatingsRelations = relations(foodRatings, ({ one }) => ({
    food: one(foodItems, {
        fields: [foodRatings.foodId],
        references: [foodItems.id],
    }),
    restaurant: one(restaurants, {
        fields: [foodRatings.restaurantId],
        references: [restaurants.id],
    }),
    user: one(users, {
        fields: [foodRatings.restaurantId],
        references: [users.id],
    }),
}));

export const cuisines = pgTable("cuisines", {
    id: serial("id").primaryKey(),
    name: text("name").notNull().unique(),
});

export const cuisineRelations = relations(cuisines, ({ many }) => ({
    restaurantCuisine: many(restaurantCuisines),
}));

export const restaurantCuisines = pgTable(
    "restaurant_cuisines",
    {
        restaurantId: integer("restaurant_id")
            .notNull()
            .references(() => restaurants.id),
        cuisineId: integer("cuisine_id")
            .notNull()
            .references(() => cuisines.id),
    },
    (table) => {
        return {
            uniqueRestaurantCuisine: uniqueIndex(
                "unique_restaurant_cuisine",
            ).on(table.restaurantId, table.cuisineId),
        };
    },
);

export const restaurantCuisinesRelations = relations(
    restaurantCuisines,
    ({ one }) => ({
        cuisine: one(cuisines, {
            fields: [restaurantCuisines.cuisineId],
            references: [cuisines.id],
        }),
        restaurant: one(restaurants, {
            fields: [restaurantCuisines.restaurantId],
            references: [restaurants.id],
        }),
    }),
);

export const restaurantFoodItems = pgTable(
    "restaurant_food_items",
    {
        foodId: integer("food_id")
            .notNull()
            .references(() => foodItems.id),
        restaurantId: integer("restaurant_id")
            .notNull()
            .references(() => restaurants.id),
    },
    (table) => {
        return {
            uniqueRestaurantFoodItem: uniqueIndex(
                "unique_restaurant_food_item",
            ).on(table.restaurantId, table.foodId),
        };
    },
);

export const restaurantFoodItemRelations = relations(
    restaurantFoodItems,
    ({ one }) => ({
        foodItem: one(foodItems, {
            fields: [restaurantFoodItems.foodId],
            references: [foodItems.id],
        }),
        restaurant: one(restaurants, {
            fields: [restaurantFoodItems.restaurantId],
            references: [restaurants.id],
        }),
    }),
);

export const sessions = pgTable("sessions", {
    sid: text("sid").primaryKey(),
    data: json("data").notNull(),
    expiresAt: timestamp("expires_at"),
});
