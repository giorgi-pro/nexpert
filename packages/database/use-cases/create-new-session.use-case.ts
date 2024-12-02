import { getDatabase } from "@repo/database";
import { type NewSession, sessions } from "@repo/database/schema";

import { z } from "zod";
import moment from "moment";
import { nanoid } from "nanoid";

import { getServerConfig } from "@repo/config";
import { eq } from "drizzle-orm";

const getNewSessionDefaults = (
	config: ReturnType<typeof getServerConfig>,
): Omit<NewSession, "id" | "userId"> => ({
	code: nanoid(config.encryption.authCodeLength),
	status: "INACTIVE",
	expiresAt: moment()
		.add(config.encryption.authCodeExpiresIn, "milliseconds")
		.toDate(),
});

const createNewSessionOptionsSchema = z.object({
	userId: z.string().uuid(),
});

type CreateNewSessionOptions = z.infer<typeof createNewSessionOptionsSchema>;

export default async function createNewSession(
	options: CreateNewSessionOptions,
) {
	const config = getServerConfig();

	const { userId } = createNewSessionOptionsSchema.parse(options);
	const values = { ...getNewSessionDefaults(config), userId };
	const db = await getDatabase();

	const invalidateExistingSessions = async (userId: string, tx: typeof db) => {
		return tx
			.update(sessions)
			.set({ status: "SUSPENDED" })
			.where(eq(sessions.userId, userId));
	};

	const insertNewSession = async (values: NewSession, tx: typeof db) => {
		return tx
			.insert(sessions)
			.values(values)
			.returning()
			.then(([session]) => session);
	};

	return db.transaction(async (tx) => {
		await invalidateExistingSessions(userId, tx);
		return insertNewSession(values, tx);
	});
}
