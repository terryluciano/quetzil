'use strict';

import session from 'express-session';
import { sessions } from '../schema';
import { db } from '../services/db.service';
import { eq, lte } from 'drizzle-orm';

class DrizzleSessionStore extends session.Store {
	constructor() {
		super();
	}

	#getExpiresAt = (session: session.SessionData): Date => {
		return (
			session.cookie.expires ??
			new Date(Date.now() + (session.cookie.maxAge || 0))
		);
	};

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
			const expiresAt = this.#getExpiresAt(session);

			await db
				.insert(sessions)
				.values({
					sid: sid,
					data: session,
					expiresAt: expiresAt,
				})
				.onConflictDoUpdate({
					target: sessions.sid,
					set: { data: session, expiresAt },
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
			const expiresAt = this.#getExpiresAt(session);

			// update session
			await db
				.update(sessions)
				.set({ expiresAt: expiresAt })
				.where(eq(sessions.sid, sid));

			// delete expired sessions
			await this.#deleteExpiredSessions();

			return callback?.();
		} catch (e) {
			console.error(e);
			return callback?.();
		}
	}
}

export default DrizzleSessionStore;
