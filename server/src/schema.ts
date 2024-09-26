import { sql, relations } from "drizzle-orm";
import { serial, text, integer } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    username: text("username").unique().notNull(),
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
    name: text("name").notNull(),
    cuisine: text("cuisine"),
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
    zipCode: integer("zip_code"),
    website: text("website").notNull(),
    cuisine: text("cuisine")
        .array()
        .default(sql`ARRAY[]::text[]`),
});

export const restaurantsRelations = relations(restaurants, ({ many }) => ({
    foodRatings: many(foodRatings),
}));

export const foodRatings = pgTable("food_ratings", {
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
    score: integer("score").notNull(),
});

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
