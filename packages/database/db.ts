import { type NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { getServerConfig } from "@repo/config";
import * as schema from "./schema";

let db: NodePgDatabase<typeof schema> | undefined;
let pool: pg.Pool | undefined;

export const getDatabase = async (): Promise<NodePgDatabase<typeof schema>> => {
	if (db) {
		return db;
	}

	pool = new pg.Pool({
		connectionString: getServerConfig().database.url,
	});

	db = drizzle(pool, { schema });

	return db;
};

export async function closeDatabaseConnection() {
	if (pool) {
		await pool.end();
		db = undefined;
		pool = undefined;
	}
}

if (typeof process !== "undefined") {
	process.on("SIGTERM", () => {
		closeDatabaseConnection().catch(console.error);
	});

	process.on("SIGINT", () => {
		closeDatabaseConnection().catch(console.error);
	});
}
