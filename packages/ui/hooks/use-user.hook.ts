import { UserContext } from "@/context/user.context";
import { useContext } from "react";

export default function useUser() {
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error(`useUser must be used within a UserProvider`);
  }

  return userContext;
}
