import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthGuard } from "./AuthGuard";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";

vi.mock("@azure/msal-react", () => ({
  MsalProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useMsal: vi.fn(),
  useIsAuthenticated: vi.fn(),
}));

vi.mock("@shared/config/msal", () => ({ msalInstance: {} }));

// A LoginPage real precisa do I18nProvider e do useAuth (MSAL) - para o
// AuthGuard, o que importa é só se ela aparece ou não, por isso é mockada.
vi.mock("@features/auth/ui/LoginPage", () => ({
  LoginPage: () => <div>ecrã de login</div>,
}));

function mockMsal({ inProgress = InteractionStatus.None }: { inProgress?: InteractionStatus } = {}) {
  vi.mocked(useMsal).mockReturnValue({
    instance: { addEventCallback: vi.fn(() => "id"), removeEventCallback: vi.fn() },
    inProgress,
    accounts: [],
  } as unknown as ReturnType<typeof useMsal>);
}

describe("AuthGuard", () => {
  it("não renderiza nada enquanto há uma interacção MSAL em curso", () => {
    mockMsal({ inProgress: InteractionStatus.HandleRedirect });
    vi.mocked(useIsAuthenticated).mockReturnValue(false);
    const { container } = render(
      <AuthGuard>
        <p>app autenticada</p>
      </AuthGuard>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("mostra a LoginPage quando não há sessão activa", () => {
    mockMsal();
    vi.mocked(useIsAuthenticated).mockReturnValue(false);
    render(
      <AuthGuard>
        <p>app autenticada</p>
      </AuthGuard>
    );
    expect(screen.getByText("ecrã de login")).toBeInTheDocument();
    expect(screen.queryByText("app autenticada")).not.toBeInTheDocument();
  });

  it("monta os children quando há sessão activa", () => {
    mockMsal();
    vi.mocked(useIsAuthenticated).mockReturnValue(true);
    render(
      <AuthGuard>
        <p>app autenticada</p>
      </AuthGuard>
    );
    expect(screen.getByText("app autenticada")).toBeInTheDocument();
    expect(screen.queryByText("ecrã de login")).not.toBeInTheDocument();
  });
});
