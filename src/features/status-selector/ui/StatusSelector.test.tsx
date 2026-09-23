import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent, { PointerEventsCheckLevel } from "@testing-library/user-event";
import { StatusSelector } from "./StatusSelector";
import type { StatusOption } from "@features/status-selector/model/types";

const options: StatusOption[] = [
  { value: "draft", label: "Rascunho", tone: "neutral" },
  { value: "approved", label: "Aprovado", tone: "success" },
];

// O Radix Select depende de APIs de Pointer Events e de scrollIntoView que o
// jsdom não implementa - polyfills mínimos só para este ficheiro de testes.
beforeAll(() => {
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
  }
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }
});

function setupUser() {
  return userEvent.setup({ pointerEventsCheck: PointerEventsCheckLevel.Never });
}

describe("StatusSelector", () => {
  it("mostra o label da opção seleccionada", () => {
    render(<StatusSelector value="draft" onChange={vi.fn()} options={options} />);
    expect(screen.getByRole("combobox")).toHaveTextContent("Rascunho");
  });

  it("abre a lista e chama onChange com o value da opção escolhida", async () => {
    const onChange = vi.fn();
    const u = setupUser();
    render(<StatusSelector value="draft" onChange={onChange} options={options} />);

    await u.click(screen.getByRole("combobox"));
    await u.click(await screen.findByRole("option", { name: "Aprovado" }));

    expect(onChange).toHaveBeenCalledWith("approved");
  });

  it("fica desactivado quando `disabled`", () => {
    render(<StatusSelector value="draft" onChange={vi.fn()} options={options} disabled />);
    expect(screen.getByRole("combobox")).toBeDisabled();
  });
});
