import { Command } from "commander";
import { parse } from "csv-parse";
import { createReadStream } from "node:fs";
import path from "node:path";
import { getDatabase } from "@repo/database/db";
import { roles, permissions, users } from "@repo/database/schema";

const program = new Command();

async function parseCsvFile<T>(filePath: string): Promise<T[]> {
	const records: T[] = [];
	const parser = createReadStream(filePath).pipe(
		parse({
			columns: true,
			skip_empty_lines: true,
		}),
	);

	for await (const record of parser) {
		records.push(record as T);
	}

	return records;
}

async function seedDatabase() {
	const db = await getDatabase();
	try {
		await db.transaction(async (tx) => {
			console.log("Starting database seeding...");

			// Path to the seeds directory
			const seedsDir = path.join(__dirname, "../../packages/database/seeds");

			// Seed roles
			console.log("Seeding roles...");
			const rolesData = await parseCsvFile<typeof roles.$inferInsert>(
				path.join(seedsDir, "roles.csv"),
			);
			await tx.insert(roles).values(rolesData).onConflictDoNothing();

			// Seed users
			console.log("Seeding users...");
			const usersData = await parseCsvFile<typeof users.$inferInsert>(
				path.join(seedsDir, "users.csv"),
			);
			await tx.insert(users).values(usersData).onConflictDoNothing();

			// Seed permissions
			console.log("Seeding permissions...");
			const permissionsData = await parseCsvFile<
				typeof permissions.$inferInsert
			>(path.join(seedsDir, "permissions.csv"));
			await tx
				.insert(permissions)
				.values(
					permissionsData.map(({ roleId, action }) => ({
						roleId,
						action,
					})),
				)
				.onConflictDoNothing();

			console.log("Database seeding completed successfully!");
		});
	} catch (error) {
		console.error("Error seeding database:", error);
		process.exit(1);
	}
}

program
	.command("seed")
	.description("Seed the database with initial data")
	.action(async () => {
		await seedDatabase();
		process.exit(0);
	});

program.parse(process.argv);
