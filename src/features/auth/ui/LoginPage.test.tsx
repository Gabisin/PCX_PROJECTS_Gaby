import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nProvider } from "@shared/i18n";
import { LoginPage } from "./LoginPage";
import { useAuth } from "@features/auth/model/useAuth";

vi.mock("@features/auth/model/useAuth", () => ({
  useAuth: vi.fn(),
}));

function renderLoginPage() {
  return render(
    <I18nProvider>
      <LoginPage />
    </I18nProvider>
  );
}

describe("LoginPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    // Idioma do browser não suportado, para o I18nProvider arrancar sempre em "pt" (default previsível para o teste).
    vi.spyOn(window.navigator, "language", "get").mockReturnValue("de-DE");
  });

  it("mostra o título de boas-vindas e o logo da Africell", () => {
    vi.mocked(useAuth).mockReturnValue({ login: vi.fn() } as unknown as ReturnType<typeof useAuth>);
    renderLoginPage();
    expect(screen.getByText("Bem-vindo")).toBeInTheDocument();
    expect(screen.getAllByAltText("Africell").length).toBeGreaterThan(0);
  });

  it("mostra o copyright com o ano actual", () => {
    vi.mocked(useAuth).mockReturnValue({ login: vi.fn() } as unknown as ReturnType<typeof useAuth>);
    renderLoginPage();
    const year = String(new Date().getFullYear());
    expect(screen.getAllByText(new RegExp(year)).length).toBeGreaterThan(0);
  });

  it("ao clicar em entrar, chama login() e mostra o estado 'a iniciar sessão'", async () => {
    let resolveLogin: () => void = () => {};
    const login = vi.fn(() => new Promise<void>((resolve) => { resolveLogin = resolve; }));
    vi.mocked(useAuth).mockReturnValue({ login } as unknown as ReturnType<typeof useAuth>);
    renderLoginPage();

    const button = screen.getByRole("button", { name: /Entrar com Microsoft/ });
    await userEvent.click(button);

    expect(login).toHaveBeenCalledOnce();
    expect(await screen.findByText("A iniciar sessão…")).toBeInTheDocument();
    expect(button).toBeDisabled();

    resolveLogin();
  });

  it("quando login() falha, mostra o erro e volta a activar o botão", async () => {
    const login = vi.fn().mockRejectedValue(new Error("network"));
    vi.mocked(useAuth).mockReturnValue({ login } as unknown as ReturnType<typeof useAuth>);
    renderLoginPage();

    await userEvent.click(screen.getByRole("button", { name: /Entrar com Microsoft/ }));

    expect(await screen.findByText("Não foi possível iniciar sessão. Tente novamente.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Entrar com Microsoft/ })).toBeEnabled();
  });
});
