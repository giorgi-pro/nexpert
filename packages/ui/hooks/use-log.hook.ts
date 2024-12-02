import logAction from "../actions/log.action";
import { useServerAction } from "./use-server-action";

export default function useLog() {
	const { callAction } = useServerAction(logAction);

	return callAction;
}
