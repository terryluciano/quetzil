import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

let postgresDB: PostgresJsDatabase;

try {
	const queryClient = postgres({
		host: process.env.DB_HOST,
		port: Number(process.env.DB_PORT),
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		ssl: 'prefer',
	});
	postgresDB = drizzle(queryClient);
} catch (error) {
	console.error('Error connecting to the database:', error);
	process.exit(1);
}

export const db = postgresDB;
