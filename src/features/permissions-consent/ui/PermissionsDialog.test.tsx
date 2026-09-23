import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PermissionsDialog } from "./PermissionsDialog";
import type { PermissionScope } from "@features/permissions-consent/model/types";

const scopes: PermissionScope[] = [
  { group: "Identidade Básica", label: "Iniciar sessão", description: "desc", status: "granted" },
  { group: "SharePoint", label: "Ler dados do site", description: "desc", status: "required" },
];

describe("PermissionsDialog", () => {
  it("agrupa os scopes por `group` e mostra o respectivo estado", () => {
    render(<PermissionsDialog open onOpenChange={vi.fn()} scopes={scopes} />);
    expect(screen.getByText("Identidade Básica")).toBeInTheDocument();
    expect(screen.getByText("SharePoint")).toBeInTheDocument();
    expect(screen.getByText("Consentido")).toBeInTheDocument();
    expect(screen.getByText("Necessário")).toBeInTheDocument();
  });

  it("com permissões em falta, o botão de conceder fica activo e chama onRequestConsent", async () => {
    const onRequestConsent = vi.fn();
    render(<PermissionsDialog open onOpenChange={vi.fn()} scopes={scopes} onRequestConsent={onRequestConsent} />);
    const button = screen.getByRole("button", { name: /Conceder permissões em falta/ });
    expect(button).toBeEnabled();
    await userEvent.click(button);
    expect(onRequestConsent).toHaveBeenCalledOnce();
  });

  it("com todos os scopes concedidos, mostra a mensagem de sucesso e desactiva o botão de pedir", () => {
    const allGranted: PermissionScope[] = scopes.map((s) => ({ ...s, status: "granted" }));
    render(<PermissionsDialog open onOpenChange={vi.fn()} scopes={allGranted} />);
    expect(screen.getByText("Todas as permissões concedidas")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Conceder permissões em falta/ })).not.toBeInTheDocument();
  });

  it("fechar chama onOpenChange(false)", async () => {
    const onOpenChange = vi.fn();
    render(<PermissionsDialog open onOpenChange={onOpenChange} scopes={scopes} />);
    // O DialogContent do kit já traz o seu próprio botão "Fechar" (X) - o nosso
    // botão de texto é o primeiro "Fechar" acessível no DOM.
    const [footerCloseButton] = screen.getAllByRole("button", { name: "Fechar" });
    await userEvent.click(footerCloseButton);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
