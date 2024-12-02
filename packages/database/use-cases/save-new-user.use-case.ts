import { getDatabase } from "@repo/database";
import { users, type NewUser } from "@repo/database/schema";

type SaveNewUserOptions = {
	data: NewUser;
};

export const saveNewUser = async (options: SaveNewUserOptions) => {
	const db = await getDatabase();
	const [savedUser] = await db.insert(users)
		.values(options.data)
		.returning();
	
	return {
		id: savedUser.id,
		email: savedUser.email,
		firstName: savedUser.firstName,
		lastName: savedUser.lastName,
	};
};
