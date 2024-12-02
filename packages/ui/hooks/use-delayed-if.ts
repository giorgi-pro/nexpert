import { useState, useEffect, useRef } from "react";

const DEFAULT_DELAY = 200;

export default function useDelayedIf(
  condition: boolean,
  delay = DEFAULT_DELAY,
) {
  const [isConditionMet, setIsConditionMet] = useState(condition);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (condition && !isConditionMet) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setIsConditionMet(true);
      }, delay);
    } else if (!condition) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsConditionMet(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [condition, delay, isConditionMet]);

  return isConditionMet;
}
