import { config } from "dotenv";
import type { Config } from "drizzle-kit";

config({ path: ".env" });

export default {
    schema: "./src/schema.ts",
    out: "./migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: `postgres://${process.env.DB_USER}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    },
    strict: true,
    verbose: true,
} satisfies Config;
