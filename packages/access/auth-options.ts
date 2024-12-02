import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt, { TokenExpiredError } from "jsonwebtoken";

import { getSession } from "@repo/database/use-cases/get-session.use-case";
import type { JWT } from "next-auth/jwt";
import { getActiveUser } from "@repo/database/use-cases/get-active-user.use-case";
import { getServerConfig } from "@repo/config";
import logger from "@repo/logging";

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				code: { label: "Code", type: "text" },
			},
			async authorize(credentials: Record<"code", string> | undefined) {
				if (!credentials?.code) {
					return {
						id: "",
					};
				}

				const session = await getSession({ code: credentials.code });

				if (!session) {
					return {
						id: "",
					};
				}

				const user = await getActiveUser({ id: session.userId });

				return {
					id: session.userId || "",
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
					role: user.role,
					permissions: user.permissions,
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token, user, account }: any) {
			const config = getServerConfig();
			// upon initial login
			if (account && user) {
				const { accessToken, refreshToken } = getTokens(user);

				return {
					...user,
					accessToken,
					refreshToken,
				};
			}

			// upon subsequent visits
			if (token?.accessToken) {
				try {
					const payload = jwt.verify(
						token.accessToken,
						config.encryption.jwtSecret,
					) as {
						id: string;
						email: string;
						firstName: string;
						lastName: string;
						role: string;
						permissions: string[];
					};

					return {
						...token,
						...payload,
					};
				} catch (error: any) {
					if (error instanceof TokenExpiredError) {
						try {
							const refreshPayload = jwt.verify(
								token.refreshToken,
								config.encryption.jwtSecret,
							) as {
								id: string;
							};

							const user = await getActiveUser({ id: refreshPayload.id });

							const { accessToken, refreshToken } = getTokens(user);

							return {
								...user,
								accessToken,
								refreshToken,
							};
						} catch (error) {
							logger.error("Token refresh failed:", error);
							return { ...token, error: "RefreshAccessTokenError" };
						}
					}
					logger.error("Token is invalid:", error);
					return { ...token, error: "InvalidAccessToken" };
				}
			}

			return token;
		},
		async session({ session, token }: { session: any; token: JWT }) {
			session.user.accessToken = token.accessToken;
			session.user.refreshToken = token.refreshToken;
			session.user.id = token.id;
			session.user.email = token.email;
			session.user.firstName = token.firstName;
			session.user.lastName = token.lastName;
			session.user.role = token.role;
			session.user.permissions = token.permissions;

			return session;
		},
	},
	jwt: {
		encode: ({ token }) => {
			return JSON.stringify(token);
		},
		decode: ({ token }) => {
			return JSON.parse(token || "{}");
		},
	},
};

function getTokens(payload: {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	role: string;
	permissions: string[];
}) {
	const config = getServerConfig();

	const accessToken = jwt.sign(
		{
			id: payload.id,
			email: payload.email,
			firstName: payload.firstName,
			lastName: payload.lastName,
			role: payload.role,
			permissions: payload.permissions,
		},
		config.encryption.jwtSecret,
		{ expiresIn: config.encryption.accessTokenExpiresIn },
	);

	const refreshToken = jwt.sign(
		{
			sub: payload.id,
			type: "refresh",
		},
		config.encryption.jwtSecret,
		{ expiresIn: config.encryption.refreshTokenExpiresIn },
	);

	return { accessToken, refreshToken };
}
