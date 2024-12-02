/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { JWT } from "next-auth/jwt"
import NextAuth from "next-auth"
// import getSessionByCode from "@/infra/db/queries/security.queries/get-session-by-code.query";
// import getUserBy from "@/infra/db/queries/user.queries/get-user-by.query";

const ACCESS_TOKEN_SECRET = "3a74e3a9b347cfd82dcf65c3f72cf8d4d65af8d3e074cd9c9632293e74f93a5b"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        code: { label: "Code", type: "text" },
      },
      async authorize(credentials: Record<"code", string> | undefined) {
        // Here you would typically validate the credentials against your database
        if (!credentials?.code) {
          return null
        }

        const session = undefined as { userId: string } | undefined

        if (!session) {
          return null
        }

        return {
          id: session.userId,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        const userId = user.id

        const member = undefined as any

        if (!member) {
          return null
        }

        return { ...member }
      }
      return token
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (session.user) {
        session.user.id = token.id
        session.user.email = token.email
        session.user.username = token.username
        session.user.countryId = token.countryId
        session.user.points = token.points
        session.user.clearanceLevel = token.clearanceLevel
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// function validateToken(token: string) {
//   return jwt.verify(token, ACCESS_TOKEN_SECRET);
// }

// function generateAccessToken(user: any) {
//   return jwt.sign(
//     {
//       id: user.id,
//       email: user.email,
//       username: user.username,
//       countryId: user.countryId,
//       points: user.points,
//       clearanceLevel: user.clearanceLevel,
//     },
//     ACCESS_TOKEN_SECRET,
//     { expiresIn: ACCESS_TOKEN_EXPIRATION },
//   );
// }

// function generateRefreshToken(user: any) {
//   return jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, {
//     expiresIn: REFRESH_TOKEN_EXPIRATION,
//   });
// }

// async function refreshAccessToken(token: any) {
//   try {
//     // Verify the refresh token
//     jwt.verify(token.refreshToken, REFRESH_TOKEN_SECRET);

//     // Generate new access token
//     const newAccessToken = jwt.sign(
//       {
//         id: token.id,
//         email: token.email,
//         username: token.username,
//         countryId: token.countryId,
//         points: token.points,
//         clearanceLevel: token.clearanceLevel,
//       },
//       ACCESS_TOKEN_SECRET,
//       { expiresIn: ACCESS_TOKEN_EXPIRATION },
//     );

//     return {
//       ...token,
//       accessToken: newAccessToken,
//       accessTokenExpires: Date.now() + ACCESS_TOKEN_EXPIRATION * 1000,
//     };
//   } catch (error) {
//     console.error("Error refreshing access token", error);
//     // Refresh token has expired or is invalid, force re-authentication
//     return { ...token, error: "RefreshAccessTokenError" };
//   }
// }

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
const handler = NextAuth(authOptions as any)

export { handler as GET, handler as POST }
