import { z } from "zod";
import { DAYS, HOURS, MINUTES } from "@repo/common/constants";

export const serverEnvSchema = z.object({
	env: z.enum(["development", "production", "test"]).default("development"),
	database: z.object({
		url: z
			.string()
			.url()
			.default("postgres://postgres:postgres@localhost:5432/nexpert"),
	}),
	smtp: z.object({
		host: z.string().default("smtp.gmail.com"),
		port: z.coerce.number().default(587),
		from: z.string().default("nexpert <gzprotest@gmail.com>"),
		username: z.string().email().default("gzprotest@gmail.com"),
		password: z.string().default("123456"),
		ciphers: z.string().default("SSLv3"),
	}),
	encryption: z.object({
		key: z.string().regex(/^[0-9a-fA-F]{64}$/),
		saltRounds: z.coerce.number().default(12),
		authCodeExpiresIn: z.coerce.number().default(10 * MINUTES),
		authCodeLength: z.coerce.number().default(21),
		jwtSecret: z.string(),
		accessTokenExpiresIn: z.number().default(2 * HOURS),
		refreshTokenExpiresIn: z.number().default(7 * DAYS),
	}),
});

export const clientEnvSchema = z.object({
	app: z.object({
		name: z.string().default("nexpert"),
		authCodeLength: z.coerce.number().default(21),
	}),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;
