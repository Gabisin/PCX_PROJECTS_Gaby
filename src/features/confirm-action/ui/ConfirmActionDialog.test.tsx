import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmActionDialog } from "./ConfirmActionDialog";

describe("ConfirmActionDialog", () => {
  it("sem `reason`, confirmar chama onConfirm(undefined) de imediato", async () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmActionDialog open title="Aprovar este pedido?" onOpenChange={vi.fn()} onConfirm={onConfirm} />
    );
    await userEvent.click(screen.getByRole("button", { name: "Confirmar" }));
    expect(onConfirm).toHaveBeenCalledWith(undefined);
  });

  it("com motivo opcional, confirmar sem escrever nada ainda avança", async () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmActionDialog
        open
        title="Aprovar este pedido?"
        onOpenChange={vi.fn()}
        onConfirm={onConfirm}
        reason={{ label: "Comentário" }}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Confirmar" }));
    expect(onConfirm).toHaveBeenCalledWith(undefined);
  });

  it("com motivo obrigatório, confirmar sem escrever mostra o erro em vez de avançar", async () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmActionDialog
        open
        title="Rejeitar este pedido?"
        tone="destructive"
        onOpenChange={vi.fn()}
        onConfirm={onConfirm}
        reason={{ label: "Motivo", required: true, requiredError: "O motivo é obrigatório." }}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Confirmar" }));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(screen.getByText("O motivo é obrigatório.")).toBeInTheDocument();
  });

  it("depois do erro, escrever no motivo obrigatório e confirmar avança com o texto", async () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmActionDialog
        open
        title="Rejeitar este pedido?"
        tone="destructive"
        onOpenChange={vi.fn()}
        onConfirm={onConfirm}
        reason={{ label: "Motivo", required: true }}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Confirmar" }));
    expect(screen.getByText("Motivo é obrigatório.")).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText(/Motivo/), "Documentação incompleta.");
    await userEvent.click(screen.getByRole("button", { name: "Confirmar" }));
    expect(onConfirm).toHaveBeenCalledWith("Documentação incompleta.");
  });

  it("cancelar fecha o dialog sem chamar onConfirm", async () => {
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <ConfirmActionDialog open title="Cancelar pedido?" onOpenChange={onOpenChange} onConfirm={onConfirm} />
    );
    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("reinicia o motivo e o erro sempre que o dialog reabre", async () => {
    const onConfirm = vi.fn();
    const { rerender } = render(
      <ConfirmActionDialog
        open
        title="Rejeitar?"
        onOpenChange={vi.fn()}
        onConfirm={onConfirm}
        reason={{ label: "Motivo", required: true }}
      />
    );
    await userEvent.type(screen.getByLabelText(/Motivo/), "rascunho a meio");

    rerender(
      <ConfirmActionDialog
        open={false}
        title="Rejeitar?"
        onOpenChange={vi.fn()}
        onConfirm={onConfirm}
        reason={{ label: "Motivo", required: true }}
      />
    );
    rerender(
      <ConfirmActionDialog
        open
        title="Rejeitar?"
        onOpenChange={vi.fn()}
        onConfirm={onConfirm}
        reason={{ label: "Motivo", required: true }}
      />
    );
    expect(screen.getByLabelText(/Motivo/)).toHaveValue("");
  });
});
