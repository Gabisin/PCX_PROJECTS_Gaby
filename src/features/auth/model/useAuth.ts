import { useCallback } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import type { SilentRequest } from "@azure/msal-browser";
import { graphScopes, sharePointScopes } from "@shared/config/msal";
import type { AuthUser } from "@entities/user";

export function useAuth() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const account = accounts[0] ?? null;

  const user: AuthUser | null = account
    ? {
        name: account.name ?? account.username,
        email: account.username,
        tenantId: account.tenantId,
      }
    : null;

  const login = useCallback(async () => {
    // Força o selector de conta Microsoft em vez de reutilizar silenciosamente
    // uma sessão já activa no browser, para se poder escolher/adicionar conta.
    await instance.loginRedirect({ scopes: graphScopes.scopes, prompt: "select_account" });
  }, [instance]);

  const logout = useCallback(async () => {
    await instance.logoutRedirect({ account });
  }, [instance, account]);

  /** Token para o Microsoft Graph (perfil, people picker). Tenta silencioso primeiro, cai para redirect. */
  const acquireGraphToken = useCallback(async (): Promise<string> => {
    if (!account) throw new Error("Not authenticated");
    const request: SilentRequest = { ...graphScopes, account };
    try {
      const result = await instance.acquireTokenSilent(request);
      return result.accessToken;
    } catch (err) {
      if (err instanceof InteractionRequiredAuthError) {
        await instance.acquireTokenRedirect(request);
        throw new Error("Redirect triggered — token will be available after redirect", { cause: err });
      }
      throw err;
    }
  }, [instance, account]);

  /** Token para a API REST do SharePoint — só útil quando `shared/api` estiver ligado a um site real. */
  const acquireSharePointToken = useCallback(async (): Promise<string> => {
    if (!account) throw new Error("Not authenticated");
    const request: SilentRequest = { ...sharePointScopes, account };
    try {
      const result = await instance.acquireTokenSilent(request);
      return result.accessToken;
    } catch (err) {
      if (err instanceof InteractionRequiredAuthError) {
        await instance.acquireTokenRedirect(request);
        throw new Error("Redirect triggered — token will be available after redirect", { cause: err });
      }
      throw err;
    }
  }, [instance, account]);

  return { user, isAuthenticated, login, logout, acquireGraphToken, acquireSharePointToken };
}
