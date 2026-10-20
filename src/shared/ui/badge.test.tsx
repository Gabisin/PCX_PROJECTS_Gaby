import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./badge";

describe("Badge", () => {
  it("usa o tone neutral por omissão quando não se passa `tone`", () => {
    render(<Badge>Rascunho</Badge>);
    expect(screen.getByText("Rascunho")).toHaveClass("bg-muted");
  });

  it("aplica a classe correspondente ao tone pedido", () => {
    render(<Badge tone="destructive">Rejeitado</Badge>);
    expect(screen.getByText("Rejeitado")).toHaveClass("bg-destructive/10");
  });

  it("mantém className extra a par das classes do variant", () => {
    render(
      <Badge tone="success" className="ml-2">
        Aprovado
      </Badge>
    );
    const badge = screen.getByText("Aprovado");
    expect(badge).toHaveClass("bg-success/10");
    expect(badge).toHaveClass("ml-2");
  });
});
