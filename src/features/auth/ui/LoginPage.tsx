import * as React from "react";
import { Loader2 } from "lucide-react";
import { useI18n } from "@shared/i18n";
import { LanguageSwitcher } from "@features/language-switcher";
import { useAuth } from "@features/auth/model/useAuth";

/**
 * Mostrada pelo AuthGuard enquanto não houver sessão MSAL activa — layout
 * replicado à risca de access_management_system/LoginPage.tsx: painel com
 * imagem de fundo à esquerda (desktop) + formulário à direita.
 */
export function LoginPage() {
  const { t } = useI18n();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleLogin() {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      await login();
      // Em caso de sucesso o browser navega via redirect; isLoading fica
      // propositadamente true para o botão continuar desactivado até lá.
    } catch (err) {
      console.error("Login failed:", err);
      setError(t("login.error"));
      setIsLoading(false);
    }
  }

  const copyright = t("login.copyright").replace("{{year}}", String(new Date().getFullYear()));

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-white">
      <div className="absolute right-5 top-5 z-20">
        <LanguageSwitcher />
      </div>

      {/* Painel esquerdo — imagem de fundo, só em desktop */}
      <div className="relative hidden md:block md:w-[58%] lg:w-[60%]">
        <img
          src="/background.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0)_55%,rgba(255,255,255,0.65)_82%,#FFFFFF_100%)]" />
        <img
          src="/africell_logo2.jpeg"
          alt="Africell"
          className="absolute left-10 top-10 h-9 w-auto object-contain"
        />
        <p className="absolute bottom-8 left-10 text-xs text-slate-500">{copyright}</p>
      </div>

      {/* Painel direito — sign-in */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="flex w-full max-w-[400px] flex-col">
          <div className="mb-10 flex items-center gap-2.5 md:hidden">
            <img
              src="/africell_logo2.jpeg"
              alt="Africell"
              className="h-8 w-auto object-contain"
            />
            <span className="text-lg font-semibold text-slate-900">
              {t("login.brandCaption")} {t("login.brandName")}
            </span>
          </div>

          <h1 className="text-[32px] font-semibold leading-10 text-slate-900">
            {t("login.welcome")}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {t("login.subtitle")}
          </p>

          <button
            type="button"
            onClick={() => {
              void handleLogin();
            }}
            disabled={isLoading}
            aria-busy={isLoading}
            className="mt-9 flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-transparent text-sm font-semibold text-slate-900 shadow-none transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:opacity-100"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden="true" />
                {t("login.signingIn")}
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                  <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                  <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                  <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                  <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                </svg>
                {t("login.signIn")}
              </>
            )}
          </button>

          {error && <p className="mt-3 text-xs text-destructive">{error}</p>}

          <p className="mt-6 text-xs text-slate-400">
            {t("login.restricted")}
          </p>

          <p className="mt-6 text-sm text-slate-500 md:hidden">{copyright}</p>
        </div>
      </div>
    </div>
  );
}
