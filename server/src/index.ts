// imports
import express from "express";
import helmet from "helmet";
import cors from "cors";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import "dotenv/config";
import router from "./routes/router";
import session from "express-session";
import { createSelectSchema } from "drizzle-zod";
import { cuisines, foodItems, users } from "./schema";
import z from "zod";
import DrizzleSessionStore from "./utils/drizzleSessionStore";
import fs from "fs";

// db
const queryClient = postgres({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
export const db = drizzle(queryClient);

// server
const server = express();
const port = process.env.SERVER_PORT;

server.use(
    session({
        store: new DrizzleSessionStore(),
        secret: process.env.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        },
    }),
);

// Type safety for session data
const selectUserSchema = createSelectSchema(users).omit({ password: true });
type User = z.infer<typeof selectUserSchema>;

declare module "express-session" {
    interface SessionData {
        user: User;
    }
}

// body parser middleware
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(helmet());
server.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    }),
);
server.use(router);

const updateFoodItemsAndCuisines = async () => {
    try {
        console.log("Updating Food Items");
        let items: { name: string }[];

        const data = fs.readFileSync("public/data.json", "utf8");

        const obj = JSON.parse(data);
        items = obj?.items;

        const filteredItems = items.filter(
            (item, index, arr) =>
                arr.findIndex((item2) => item2.name === item.name) === index,
        );

        await db.insert(foodItems).values(filteredItems).onConflictDoNothing();

        console.log("Finished updating Food Items");

        //////////////////////////////////////////////

        console.log("Updating Cuisines");

        let cuisinesArr: { name: string }[];

        cuisinesArr = obj?.cuisines;

        const filteredCuisines = cuisinesArr.filter(
            (item, index, arr) =>
                arr.findIndex((item2) => item2.name === item.name) === index,
        );

        await db
            .insert(cuisines)
            .values(filteredCuisines)
            .onConflictDoNothing();

        console.log("Finished updating Cuisines");
    } catch (err) {
        console.error(
            "Error occurred while updating food items and cuisines: " + err,
        );
    }
};

server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
    updateFoodItemsAndCuisines();
});
