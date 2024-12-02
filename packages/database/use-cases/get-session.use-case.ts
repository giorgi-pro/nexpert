import { getDatabase } from "@repo/database";
import { sessions } from "@repo/database/schema";
import { eq } from "drizzle-orm";

import { z } from "zod";

const getSessionOptionsSchema = z.object({
	code: z.string().max(255),
});

type GetSessionOptions = z.infer<typeof getSessionOptionsSchema>;

export const getSession = async (options: GetSessionOptions) => {
	const { code } = getSessionOptionsSchema.parse(options);
	const db = await getDatabase();

	return db
		.select()
		.from(sessions)
		.where(eq(sessions.code, code))
		.then(([session]) => ({
			id: session.id,
			userId: session.userId,
			createdAt: session.createdAt,
			expiresAt: session.expiresAt,
			status: session.status,
		}));
};
