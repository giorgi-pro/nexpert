import { useEffect, useRef } from "react";
import type { DependencyList, EffectCallback } from "react";

type AsyncEffectCallback = () => Promise<void>;

export default function useSingleEffect(
	effect: EffectCallback | AsyncEffectCallback,
	predicate: unknown,
	deps: DependencyList,
) {
	const occurred = useRef(false);

	useEffect(() => {
		if (!predicate) {
			occurred.current = false;
			return;
		}
		if (occurred.current) return;

		const result = effect();
		if (result instanceof Promise) {
			// Handle async effect
			result.catch(console.error);
		}

		occurred.current = true;
	}, [effect, predicate, ...deps]);
}
