import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppProviders } from "@app/providers";
import { AppRouter } from "@app/routes/AppRouter";
import { AuthGuard } from "@features/auth";
import { msalInstance } from "@shared/config/msal";
import "@app/styles/index.css";

(async () => {
  try {
    await msalInstance.initialize();
    const response = await msalInstance.handleRedirectPromise();
    if (response?.account) {
      msalInstance.setActiveAccount(response.account);
    }
  } catch (err) {
    console.error("MSAL initialization failed", err);
  }

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      {/* AppProviders por fora do AuthGuard: a LoginPage (renderizada pelo AuthGuard
          quando não há sessão) usa useI18n, por isso o I18nProvider tem de já estar montado. */}
      <AppProviders>
        <AuthGuard>
          <AppRouter />
        </AuthGuard>
      </AppProviders>
    </StrictMode>
  );
})();
