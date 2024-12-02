import nodemailer, { type SendMailOptions } from "nodemailer";

import logger from "@repo/logging";
import { getServerConfig } from "@repo/config";

const config = getServerConfig();
const { smtp } = config;

const transport = nodemailer.createTransport({
	host: smtp.host,
	port: smtp.port,
	from: smtp.from,
	secure: false,
	requireTLS: true,
	auth: {
		type: "LOGIN",
		user: smtp.username,
		pass: smtp.password,
	},
	tls: { rejectUnauthorized: false, ciphers: smtp.ciphers },
	debug: true,
});

type Email = string;

type SendOptions = {
	to: Email | Email[];
	subject: string;
	body: string;
};

export default async (options: SendOptions) => {
	const { subject, body: html } = options;

	const to =
		typeof options.to === "string" ? options.to : options.to.join(", ");

	const sendOptions: SendMailOptions = {
		to,
		subject,
		html,
	};

	return new Promise((resolve, reject) => {
		transport.sendMail(sendOptions, (error, info) => {
			if (error) {
				logger.warn("Couldn't send an email", { options, error });
				reject(error);
			} else {
				logger.warn("Email sent successfully", { options, info });
				resolve(undefined);
			}
		});
	});
};
