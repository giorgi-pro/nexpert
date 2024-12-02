import logger from "@repo/logging";

export default function logAction(
	level: "info" | "error" | "warn" | "debug",
	description: string,
	payload?: object,
) {
	logger[level](description, payload);
}
