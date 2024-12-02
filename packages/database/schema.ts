import { sql } from "drizzle-orm";
import {
	timestamp,
	pgTable,
	varchar,
	boolean,
	uuid,
	pgEnum,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: uuid("id").defaultRandom().primaryKey(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	firstName: varchar("first_name", { length: 100 }).notNull(),
	lastName: varchar("last_name", { length: 100 }).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
	roleId: uuid("role_id")
		.notNull()
		.references(() => roles.id),
});

export const sessionStatusEnum = pgEnum("session_status", [
	"INACTIVE",
	"ACTIVE",
	"SUSPENDED",
	"EXPIRED",
]);

export const sessions = pgTable("sessions", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: uuid("user_id")
		.references(() => users.id)
		.notNull(),
	code: varchar("code", { length: 255 }).notNull(),
	createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	status: sessionStatusEnum("status").notNull(),
	tokenHash: varchar("token_hash", { length: 255 }),
});

export const roles = pgTable("roles", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: varchar("name", { length: 100 }).notNull().unique(),
});

export const permissions = pgTable("permissions", {
	id: uuid("id").defaultRandom().primaryKey(),
	roleId: uuid("role_id")
		.references(() => roles.id)
		.notNull(),
	action: varchar("action", { length: 100 }).notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;
export type Permission = typeof permissions.$inferSelect;
export type NewPermission = typeof permissions.$inferInsert;
