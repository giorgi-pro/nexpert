import { SECOND } from "@repo/common/constants/common.constant";
import { useEffect, useState } from "react";

const DEFAULT_SUSPENSE_DELAY = 5 * SECOND;

export function useSuspense(delay = DEFAULT_SUSPENSE_DELAY) {
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");

  const fetchData = () => {
    setStatus("pending");
    return new Promise((resolve) => {
      setTimeout(() => {
        setStatus("success");
        resolve(null);
      }, delay); // 2 seconds delay
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    status,
    refetch: fetchData,
  };
}
