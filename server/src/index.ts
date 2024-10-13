// imports
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import 'dotenv/config';
import router from './routes/router';
import session from 'express-session';
import { createSelectSchema } from 'drizzle-zod';
import { users } from './schema';
import z from 'zod';
import DrizzleSessionStore from './utils/drizzleSessionStore';

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
	})
);

// Type safety for session data
const selectUserSchema = createSelectSchema(users).omit({ password: true });
type User = z.infer<typeof selectUserSchema>;

declare module 'express-session' {
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
		origin: 'http://localhost:3000',
		credentials: true,
	})
);
server.use(router);

server.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});
