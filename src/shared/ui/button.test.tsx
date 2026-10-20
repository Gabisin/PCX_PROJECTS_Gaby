import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./button";

describe("Button", () => {
  it("chama onClick quando premido", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Guardar</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Guardar" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("fica desactivado e com aria-busy quando isLoading, mesmo sem disabled explícito", () => {
    render(<Button isLoading>A processar</Button>);
    const button = screen.getByRole("button", { name: /A processar/ });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("não dispara onClick quando isLoading (fica disabled)", async () => {
    const onClick = vi.fn();
    render(
      <Button isLoading onClick={onClick}>
        A processar
      </Button>
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("com asChild, renderiza o filho (ex.: <a>) em vez de <button>", () => {
    render(
      <Button asChild>
        <a href="/pedidos">Ver pedidos</a>
      </Button>
    );
    const link = screen.getByRole("link", { name: "Ver pedidos" });
    expect(link).toHaveAttribute("href", "/pedidos");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
