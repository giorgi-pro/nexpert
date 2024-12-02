import { useCallback, useRef } from "react";

const DEFAULT_DELAY = 200;

const useDebouncedAction = (delay = DEFAULT_DELAY) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  return useCallback(
    (action: () => void) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(action, delay);
    },
    [delay],
  );
};

export default useDebouncedAction;
