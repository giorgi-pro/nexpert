import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { getClient } from "@repo/database/pg-client";
import logger from "@repo/logging";

const runMigrations = async () => {
  try {
    const pgClient = getClient();
    await pgClient.connect();

    const db = drizzle(pgClient);

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const migrationsFolder = join(__dirname, "migrations");

    await migrate(db, { migrationsFolder });

    await pgClient.end();
  } catch (err) {
    logger.error(err, "Failed to run migrations");
    throw err;
  }
};

runMigrations();
