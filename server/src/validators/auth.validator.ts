import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { users } from '../schema';
import z from 'zod';

export const insertUserSchema = createInsertSchema(users, {
	password: (schema) =>
		schema.password
			.min(8, { message: 'Password must be at least 8 characters long' })
			.max(32, {
				message: 'Password must be no more than 32 characters long',
			}),
	email: (schema) => schema.email.email(),
});

export type UserInsertType = z.infer<typeof insertUserSchema>;

export const selectUserSchema = createSelectSchema(users, {
	email: (schema) => schema.email.email(),
}).pick({
	password: true,
	email: true,
});
