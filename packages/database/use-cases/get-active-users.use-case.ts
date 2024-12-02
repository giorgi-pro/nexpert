import { getDatabase } from "@repo/database";
import { permissions, roles, users } from "@repo/database/schema";
import { asc, eq } from "drizzle-orm";

import extractLimit from "./helpers/extract-limit.helper";

import {
	DEFAULT_PAGE_INDEX,
	DEFAULT_PAGE_SIZE,
} from "../constants/default-values.constant";

type GetActiveUsersPagingOptions = {
	pageIndex: number;
	pageSize: number;
};

type GetActiveUsersOptions = {
	pagingOptions?: GetActiveUsersPagingOptions;
};

const DEFAULT_PAGING_OPTIONS: GetActiveUsersPagingOptions = {
	pageIndex: DEFAULT_PAGE_INDEX,
	pageSize: DEFAULT_PAGE_SIZE,
};

export const getActiveUsers = async (options: GetActiveUsersOptions = {}) => {
	const db = await getDatabase();
	const { pagingOptions = DEFAULT_PAGING_OPTIONS } = options;
	const { offset, limit } = extractLimit(pagingOptions);

	const result = await db
		.select({
			id: users.id,
			email: users.email,
			firstName: users.firstName,
			lastName: users.lastName,
			createdAt: users.createdAt,
			role: roles.name,
			permissions: permissions.action,
		})
		.from(users)
		.innerJoin(roles, eq(users.roleId, roles.id))
		.innerJoin(permissions, eq(roles.id, permissions.roleId))
		.orderBy(asc(users.createdAt))
		.limit(limit)
		.offset(offset);

	const groupedUsers = result.reduce(
		(acc, row) => {
			if (!acc[row.id]) {
				acc[row.id] = {
					id: row.id,
					email: row.email,
					firstName: row.firstName,
					lastName: row.lastName,
					createdAt: row.createdAt,
					role: row.role,
					permissions: [],
				};
			}
			acc[row.id].permissions.push(row.permissions);
			return acc;
		},
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		{} as Record<string, any>,
	);

	return Object.values(groupedUsers);
};
