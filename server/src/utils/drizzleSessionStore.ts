import session from 'express-session';

class DrizzleSessionStore extends session.Store {
	constructor() {
		super();
	}

	async destroy(sid: string, callback?: (err?: any) => void): void {
		try {
			callback(null);
		} catch (e) {
			return callback(e);
		}
	}

	async set(
		sid: string,
		session: session.SessionData,
		callback?: (err?: any) => void
	): void {
		try {
		} catch (e) {
			return callback(e);
		}
	}

	async get(
		sid: string,
		callback: (err: any, session?: session.SessionData | null) => void
	): void {}

	async touch(
		sid: string,
		session: session.SessionData,
		callback?: () => void
	): void {}
}

export default DrizzleSessionStore;
