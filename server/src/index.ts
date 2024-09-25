// imports
import express, { Request, Response } from "express";
import helmet from "helmet";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import "dotenv/config";
import router from "./routes/router";

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

server.use(helmet());
server.use(router);

server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
