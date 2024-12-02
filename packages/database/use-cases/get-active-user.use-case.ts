import { getDatabase } from "@repo/database";
import { permissions, roles, users } from "@repo/database/schema";
import { eq } from "drizzle-orm";

import { z } from "zod";

const getActiveUserOptionsSchema = z
	.object({
		email: z.string().email().max(255).optional(),
		id: z.string().max(255).optional(),
	})
	.refine((data) => data.email !== undefined || data.id !== undefined, {
		message: "Either email or id must be provided",
	});

type GetActiveUserOptions = z.infer<typeof getActiveUserOptionsSchema>;

type GetActiveUserResult = Pick<
	typeof users.$inferSelect,
	"email" | "firstName" | "lastName" | "id"
> & {
	permissions: string[];
	role: string;
};

export const getActiveUser = async (
	options: GetActiveUserOptions,
): Promise<GetActiveUserResult> => {
	const { email, id } = getActiveUserOptionsSchema.parse(options);
	const db = await getDatabase();

	const result = await db
		.select({
			id: users.id,
			email: users.email,
			firstName: users.firstName,
			lastName: users.lastName,
			role: roles.name,
			permissions: permissions.action,
		})
		.from(users)
		.innerJoin(roles, eq(users.roleId, roles.id))
		.innerJoin(permissions, eq(roles.id, permissions.roleId))
		.where(id ? eq(users.id, id) : email ? eq(users.email, email) : undefined);

	if (!result.length) {
		throw new Error("User not found");
	}

	// Group the results to handle multiple permissions
	const user = result[0];
	return {
		id: user.id,
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
		role: user.role,
		permissions: result.map((r) => r.permissions),
	};
};
