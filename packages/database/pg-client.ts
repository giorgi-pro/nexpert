import pg from "pg";
import { getServerConfig } from "@repo/config";

export const getClient = () =>
	new pg.Client({
		connectionString: getServerConfig().database.url,
	});
