import useDelayedIf from "@repo/ui/hooks/use-delayed-if";
import { useSession } from "next-auth/react";
import { type ReactNode, createContext, useEffect, useState } from "react";

import type { User } from "~/types";

type UserContextProps = {
  user?: User | null;
  sessionReady: boolean;
};

export const UserContext = createContext<UserContextProps>({
  user: null,
  sessionReady: false,
});

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [userState, setUserState] = useState<UserContextProps>({
    user: null,
    sessionReady: false,
  });

  const session = useSession();

  const sessionReady = useDelayedIf(session.status !== "loading");

  useEffect(() => {
    if (!sessionReady) {
      return;
    }
    setUserState({ user: session.data?.user, sessionReady });
  }, [session.data?.user, sessionReady]);

  return (
    <UserContext.Provider value={userState}>{children}</UserContext.Provider>
  );
};

export const UserConsumer = UserContext.Consumer;
