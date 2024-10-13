'use strict';

import session from 'express-session';
import { sessions } from '../schema';
import { db } from '..';
import { eq, lte } from 'drizzle-orm';

class DrizzleSessionStore extends session.Store {
	constructor() {
		super();
	}

	#deleteExpiredSessions = async () => {
		try {
			await db
				.delete(sessions)
				.where(lte(sessions.expiresAt, new Date()));

			return;
		} catch (e) {
			console.error(e);
			return;
		}
	};

	async set(
		sid: string,
		session: session.SessionData,
		callback?: (err?: any) => void
	): Promise<void> {
		try {
			await db.insert(sessions).values({
				sid: sid,
				data: session,
				expiresAt: session.cookie.expires,
			});
			return callback?.(null);
		} catch (e) {
			return callback?.(e);
		}
	}

	async get(
		sid: string,
		callback: (err: any, session?: any) => void
	): Promise<void> {
		try {
			// get session
			const selectQuery = await db
				.select()
				.from(sessions)
				.where(eq(sessions.sid, sid));

			// check if session exists
			if (selectQuery.length > 0) {
				// check if session is expired
				if (
					selectQuery[0].expiresAt &&
					selectQuery[0].expiresAt < new Date()
				) {
					// delete session
					await db.delete(sessions).where(eq(sessions.sid, sid));

					return callback?.(null, null);
				}
				return callback?.(null, selectQuery[0].data);
			} else {
				return callback?.(null, null);
			}
		} catch (e) {
			return callback?.(e);
		}
	}

	async destroy(sid: string, callback?: (err?: any) => void): Promise<void> {
		try {
			// delete session
			await db.delete(sessions).where(eq(sessions.sid, sid));

			return callback?.(null);
		} catch (e) {
			return callback?.(e);
		}
	}

	async touch(
		sid: string,
		session: session.SessionData,
		callback?: () => void
	): Promise<void> {
		try {
			// update session
			await db
				.update(sessions)
				.set({ expiresAt: session.cookie.expires })
				.where(eq(sessions.sid, sid));

			// delete expired sessions
			this.#deleteExpiredSessions();

			return callback?.();
		} catch (e) {
			console.error(e);
			return callback?.();
		}
	}
}

export default DrizzleSessionStore;
