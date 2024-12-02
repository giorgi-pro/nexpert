export const ROLES = {
	ADMIN: "admin",
	GUEST: "guest",
	MODERATOR: "moderator",
} as const;

export type Role = keyof typeof ROLES;
export type Permission = keyof typeof PERMISSIONS;

export const PERMISSIONS = {
	CREATE_USER: "create_user",
	UPDATE_USER: "update_user",
	DELETE_USER: "delete_user",
	SUSPEND_USER: "suspend_user",
	VIEW_ALL_USERS: "view_all_users",
	MANAGE_ROLES: "manage_roles",
	MANAGE_PERMISSIONS: "manage_permissions",
	VIEW_SYSTEM_LOGS: "view_system_logs",
	VIEW_OWN_PROFILE: "view_own_profile",
} as const;
