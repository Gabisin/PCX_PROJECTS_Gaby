import * as React from "react";
import { MsalProvider, useIsAuthenticated, useMsal } from "@azure/msal-react";
import { EventType, InteractionStatus } from "@azure/msal-browser";
import type { AuthenticationResult } from "@azure/msal-browser";
import { msalInstance } from "@shared/config/msal";
import { LoginPage } from "@features/auth/ui/LoginPage";

function AuthCheck({ children }: { children: React.ReactNode }) {
  const { instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  React.useEffect(() => {
    const callbackId = instance.addEventCallback((event) => {
      if (
        event.eventType === EventType.LOGIN_SUCCESS &&
        event.payload &&
        (event.payload as AuthenticationResult).account
      ) {
        instance.setActiveAccount((event.payload as AuthenticationResult).account);
      }
    });

    return () => {
      if (callbackId) instance.removeEventCallback(callbackId);
    };
  }, [instance]);

  if (inProgress !== InteractionStatus.None) return null;
  if (!isAuthenticated) return <LoginPage />;
  return <>{children}</>;
}

/** Gate de autenticação Microsoft — envolve toda a app; só monta `children` com sessão MSAL activa. */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthCheck>{children}</AuthCheck>
    </MsalProvider>
  );
}
