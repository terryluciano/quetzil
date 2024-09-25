import { serial, text } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
});

export const foodItems = pgTable("food_items", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
});
