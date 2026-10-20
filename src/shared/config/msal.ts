import { PublicClientApplication, LogLevel, BrowserCacheLocation } from "@azure/msal-browser";
import type { Configuration } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_MSAL_CLIENT_ID as string,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_MSAL_TENANT_ID as string}`,
    redirectUri: import.meta.env.VITE_MSAL_REDIRECT_URI as string,
    postLogoutRedirectUri: import.meta.env.VITE_MSAL_REDIRECT_URI as string,
  },
  cache: {
    cacheLocation: BrowserCacheLocation.SessionStorage,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
        if (containsPii) return;
        switch (level) {
          case LogLevel.Error: console.error(message); break;
          case LogLevel.Warning: console.warn(message); break;
          default: break;
        }
      },
      logLevel: LogLevel.Warning,
      piiLoggingEnabled: false,
    },
  },
};

/** Scopes para a API REST do SharePoint - só relevante quando VITE_SHAREPOINT_SITE_URL estiver preenchido. */
export const sharePointScopes = {
  scopes: [`https://${import.meta.env.VITE_SHAREPOINT_TENANT_NAME as string}.sharepoint.com/.default`],
};

/** Scopes para o Microsoft Graph (perfil, people picker). */
export const graphScopes = {
  scopes: ["User.Read", "User.ReadBasic.All"],
};

/** Instância singleton do MSAL - importar esta em vez de criar novas instâncias. */
export const msalInstance = new PublicClientApplication(msalConfig);
