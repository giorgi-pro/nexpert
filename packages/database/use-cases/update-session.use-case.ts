import { getDatabase } from "@repo/database";
import { sessions, sessionStatusEnum } from "@repo/database/schema";
import { eq } from "drizzle-orm";

import { z } from "zod";

const updateSessionOptionsSchema = z.object({
	id: z.string().uuid(),
	tokenHash: z.string().max(255).optional(),
	status: z.enum(sessionStatusEnum.enumValues).optional(),
});

type UpdateSessionOptions = z.infer<typeof updateSessionOptionsSchema>;

export const updateSession = async (options: UpdateSessionOptions) => {
	const db = await getDatabase();

	const updateData: Partial<
		Pick<typeof sessions.$inferSelect, "status" | "tokenHash">
	> = {};

	if (options.status) {
		updateData.status = options.status;
	}
	if (options.tokenHash) {
		updateData.tokenHash = options.tokenHash;
	}

	return db.update(sessions).set(updateData).where(eq(sessions.id, options.id));
};
