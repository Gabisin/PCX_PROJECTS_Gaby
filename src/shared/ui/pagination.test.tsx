import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "./pagination";

describe("Pagination", () => {
  it("não renderiza nada quando há 1 página ou menos", () => {
    const { container } = render(<Pagination page={1} pageCount={1} onPageChange={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("mostra um botão por página quando há poucas páginas (≤7)", () => {
    render(<Pagination page={1} pageCount={5} onPageChange={vi.fn()} />);
    for (const n of [1, 2, 3, 4, 5]) {
      expect(screen.getByRole("button", { name: String(n) })).toBeInTheDocument();
    }
  });

  it("marca a página actual com aria-current=page", () => {
    render(<Pagination page={3} pageCount={5} onPageChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "3" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "2" })).not.toHaveAttribute("aria-current");
  });

  it("desactiva 'Página anterior' na primeira página e 'Página seguinte' na última", () => {
    const { rerender } = render(<Pagination page={1} pageCount={5} onPageChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Página anterior" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Página seguinte" })).toBeEnabled();

    rerender(<Pagination page={5} pageCount={5} onPageChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Página anterior" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Página seguinte" })).toBeDisabled();
  });

  it("chama onPageChange com a página seguinte/anterior correcta", async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={3} pageCount={5} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Página seguinte" }));
    expect(onPageChange).toHaveBeenCalledWith(4);
    await userEvent.click(screen.getByRole("button", { name: "Página anterior" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("condensa páginas distantes com reticências quando há muitas páginas", () => {
    render(<Pagination page={10} pageCount={20} onPageChange={vi.fn()} />);
    // Sempre mostra a primeira, a última, e a vizinhança da página actual.
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "20" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "9" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "10" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "11" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "5" })).not.toBeInTheDocument();
    expect(screen.getAllByText("…").length).toBeGreaterThan(0);
  });
});
