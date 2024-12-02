import logger from "@repo/logging";
import email from "./";

const URL = "http://localhost:3000/sign-in?code=";

export default async function sendSignInLink(to: string, code: string) {
	const subject = "Your sign up link";
	const body = `<p>Hello friend and welcome to our website. This is your link to confirm your account: ${URL}${code}\r\n</p><p>Needless to remind you not to share this link with anyone 🤫</p>`;

	const emailOptions = {
		to,
		subject,
		body,
	};

	try {
		logger.info("Sending email with login token", { emailOptions });
		await email(emailOptions);
		logger.info("Email with login token sent", { emailOptions });
	} catch (error) {
		logger.warn("Error sending email with login token", { emailOptions });
		throw error;
	}
}
