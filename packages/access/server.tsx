import "server-only";
import type { Session } from "next-auth";
import assert from "node:assert";
import { type ROLES, type Permission, PERMISSIONS } from "./constants";
import NotFound404 from "@repo/ui/components/404.component"
import { authOptions } from "@repo/access/auth-options"
import { getServerSession } from "next-auth"

export type EnsureUserOptions = {
	role?: keyof typeof ROLES;
	permissions?: (keyof typeof PERMISSIONS)[];
	check?(session: Session): [boolean, string?];
};

export async function ensureUser(options?: EnsureUserOptions) {
	const session = await getServerSession(authOptions);
	assert(session, "errorCreating");

	options?.check && assert(...options.check(session));
	options?.permissions &&
		assert(
			options.permissions?.every((p) =>
				session.user?.permissions.includes(PERMISSIONS[p]),
			),
		);

	options?.role && assert(session.user?.role === options.role);
}

export async function ensureAdmin() {
	await ensureUser({ role: "ADMIN" });
}

export async function ensurePermission(permission: keyof typeof PERMISSIONS) {
	await ensureUser({ permissions: [permission] });
}

type ServerAction<TParams extends unknown[], TReturn> = (
	...args: TParams
) => Promise<TReturn>;

export function permitAction<TParams extends unknown[], TReturn>(
	permission: Permission,
	serverAction: ServerAction<TParams, TReturn>,
): ServerAction<TParams, TReturn> {
	return async (...args: TParams): Promise<TReturn> => {
		await ensureUser({ permissions: [permission] })
		return serverAction(...args)
	}
}

export function withPermission<T extends object>(
	permission: Permission,
	PageComponent: React.ComponentType<T>,
  ): React.ComponentType<T> {
	return async function AccessCheckedClientComponent(props: T) {
	  const session = await getServerSession(authOptions)

		if (session?.user?.permissions.includes(PERMISSIONS[permission])) {
			return <PageComponent {...props} />
		}
  
	  if (!session?.user) {
		return <NotFound404 />
	  }
  
	  return <NotFound404 />
	}
  }
