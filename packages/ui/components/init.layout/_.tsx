"use client";

import { SessionProvider } from "next-auth/react";
import type React from "react";
import { Toaster } from "react-hot-toast";
import { UserConsumer, UserProvider } from "../../context/user.context";
import PageLoadingComponent from "../page-loading.component";

export default function ClientLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <SessionProvider>
        <UserProvider>
          <UserConsumer>
            {({ sessionReady }) =>
              sessionReady ? props.children : <PageLoadingComponent />
            }
          </UserConsumer>
        </UserProvider>
      </SessionProvider>
      <Toaster />
    </>
  );
}
