import { users } from '../schema';
import { db } from '../services/db.service';
import { eq, exists } from 'drizzle-orm';

export const checkIfUserExists = async (email: string) => {
	try {
		const existsCondition = db
			.select()
			.from(users)
			.where(eq(users.email, email));
		const existsQuery = await db
			.select()
			.from(users)
			.where(exists(existsCondition));
	} catch (e) {}
};
