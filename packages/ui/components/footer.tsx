import { getPublicConfig } from "@repo/config";

export default function Footer() {
	const config = getPublicConfig();
	return (
		<div className="h-[50px] text-center text-sm">
			{config.app.name} 2024
		</div>
	);
}
