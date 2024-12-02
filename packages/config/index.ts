import { DAYS, HOURS, MINUTES } from "@repo/common/constants";
import { serverEnvSchema, clientEnvSchema } from "./env.schema";

/**
 * Client-side public config - only env vars prefixed with NEXT_PUBLIC_
 */
export const publicConfig = {
	app: {
		name: process.env.NEXT_PUBLIC_APP_NAME || "nexpert",
		authCodeLength: Number(process.env.NEXT_PUBLIC_APP_AUTH_CODE_LENGTH) || 21,
	},
} as const;

/**
 * Server-side only config
 */
export const serverConfig = {
	env: process.env.NODE_ENV || "development",
	database: {
		url:
			process.env.DATABASE_URL ||
			"postgres://postgres:postgres@localhost:5432/nexpert",
	},
	smtp: {
		host: process.env.SMTP_HOST || "smtp.gmail.com",
		port: Number(process.env.SMTP_PORT) || 587,
		from: process.env.SMTP_FROM || "nexpert <gzprotest@gmail.com>",
		username: process.env.SMTP_USERNAME || "gzprotest@gmail.com",
		password: process.env.SMTP_PASSWORD || "123456",
		ciphers: process.env.SMTP_CIPHERS || "SSLv3",
	},
	encryption: {
		key: process.env.APP_ENCRYPTION_KEY,
		saltRounds: Number(process.env.APP_SALT_ROUNDS) || 12,
		authCodeExpiresIn:
			Number(process.env.APP_AUTH_CODE_EXPIRES_IN) || 10 * MINUTES,
		jwtSecret: process.env.APP_JWT_SECRET,
		authCodeLength: Number(process.env.APP_AUTH_CODE_LENGTH) || 21,
		accessTokenExpiresIn:
			Number(process.env.APP_ACCESS_TOKEN_EXPIRES_IN) || 2 * HOURS,
		refreshTokenExpiresIn:
			Number(process.env.APP_REFRESH_TOKEN_EXPIRES_IN) || 7 * DAYS,
	},
} as const;

// Export type-safe config getters
export function getPublicConfig() {
	return clientEnvSchema.parse(publicConfig);
}

export function getServerConfig() {
	// Only validate on server startup
	if (typeof window === "undefined") {
		const parsed = serverEnvSchema.parse(serverConfig);
		return parsed;
	}
	throw new Error("getServerConfig can only be called on the server");
}

// Type helpers
export type PublicConfig = typeof publicConfig;
export type ServerConfig = typeof serverConfig;
