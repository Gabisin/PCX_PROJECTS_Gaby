import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LayoutGrid, FileText } from "lucide-react";
import { Sidebar } from "./Sidebar";
import type { NavSection } from "@widgets/sidebar/model/types";

const sections: NavSection[] = [
  {
    title: "Principal",
    items: [
      { label: "Pedidos", href: "/", icon: LayoutGrid },
      { label: "Documentos", href: "/documentos", icon: FileText, badgeCount: 3 },
    ],
  },
];

describe("Sidebar", () => {
  it("renderiza um link acessível por item de navegação (drawer mobile fechada fica aria-hidden)", () => {
    render(<Sidebar sections={sections} activeHref="/" isOpen={false} onOpenChange={vi.fn()} />);
    // O título da secção existe duas vezes no DOM (desktop fixa + drawer mobile),
    // mas com a drawer fechada só a cópia desktop é alcançável via role (a outra fica aria-hidden).
    expect(screen.getAllByText("Principal")).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: /Pedidos/ })).toHaveLength(1);
    expect(screen.getAllByRole("link", { name: /Documentos/ })).toHaveLength(1);
  });

  it("com a drawer mobile aberta, cada item fica acessível duas vezes (desktop + drawer)", () => {
    render(<Sidebar sections={sections} activeHref="/" isOpen onOpenChange={vi.fn()} />);
    expect(screen.getAllByRole("link", { name: /Pedidos/ })).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: /Documentos/ })).toHaveLength(2);
  });

  it("marca o item cujo href bate com activeHref via aria-current", () => {
    render(<Sidebar sections={sections} activeHref="/documentos" isOpen={false} onOpenChange={vi.fn()} />);
    expect(screen.getByRole("link", { name: /Documentos/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /Pedidos/ })).not.toHaveAttribute("aria-current");
  });

  it("mostra o badgeCount quando definido", () => {
    render(<Sidebar sections={sections} activeHref="/" isOpen={false} onOpenChange={vi.fn()} />);
    expect(screen.getAllByText("3")).toHaveLength(2);
  });

  it("usa o linkComponent passado (ex.: <Link> do router) em vez de <a> simples", () => {
    function RouterLinkStub({ href, children }: { href: string; children: React.ReactNode }) {
      return <a href={href} data-router-link="true">{children}</a>;
    }
    render(
      <Sidebar sections={sections} activeHref="/" isOpen={false} onOpenChange={vi.fn()} linkComponent={RouterLinkStub} />
    );
    const [link] = screen.getAllByRole("link", { name: /Pedidos/ });
    expect(link).toHaveAttribute("data-router-link", "true");
  });

  it("fecha a drawer mobile ao clicar no overlay ou no botão de fechar", async () => {
    const onOpenChange = vi.fn();
    render(<Sidebar sections={sections} activeHref="/" isOpen onOpenChange={onOpenChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Fechar navegação" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
