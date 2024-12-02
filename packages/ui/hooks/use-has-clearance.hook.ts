import { hasClearance } from "@/lib/auth.lib/client";
import { useSession } from "next-auth/react";
import { RequiredClearanceLevel } from "@/types";

export default function useHasClearance(
  requiredClearance: RequiredClearanceLevel,
) {
  const session = useSession();
  return hasClearance(requiredClearance, session.data);
}
