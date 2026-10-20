import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PageShell } from "./PageShell";
import type { NavSection } from "@widgets/sidebar";

const sections: NavSection[] = [];
const user = { name: "Ana Silva" };

describe("PageShell", () => {
  it("renderiza o título do header e o conteúdo (children)", () => {
    render(
      <PageShell sections={sections} activeHref="/" user={user} headerTitle="Pedidos">
        <p>Conteúdo da página</p>
      </PageShell>
    );
    expect(screen.getByRole("heading", { name: "Pedidos" })).toBeInTheDocument();
    expect(screen.getByText("Conteúdo da página")).toBeInTheDocument();
  });

  it("o botão de hambúrguer do Header abre a drawer da Sidebar", async () => {
    render(
      <PageShell sections={sections} activeHref="/" user={user}>
        <p>Conteúdo</p>
      </PageShell>
    );
    // Fechada por omissão: a drawer mobile fica aria-hidden, por isso "hidden: true" para a encontrar mesmo assim.
    const closeButton = screen.getByRole("button", { name: "Fechar navegação", hidden: true });
    expect(closeButton.closest("[aria-hidden]")).toHaveAttribute("aria-hidden", "true");
    await userEvent.click(screen.getByRole("button", { name: "Abrir navegação" }));
    expect(closeButton.closest("[aria-hidden]")).toHaveAttribute("aria-hidden", "false");
  });
});
