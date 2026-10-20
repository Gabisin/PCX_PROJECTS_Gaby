import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PeoplePicker } from "./PeoplePicker";
import type { Person } from "@features/people-picker/model/types";

const ANA: Person = { id: "1", name: "Ana Silva", email: "ana@example.com" };
const BRUNO: Person = { id: "2", name: "Bruno Costa", email: "bruno@example.com" };

function Controlled({ search, multiple = true }: { search: (q: string) => Promise<Person[]>; multiple?: boolean }) {
  const [value, setValue] = useState<Person[]>([]);
  return <PeoplePicker value={value} onChange={setValue} search={search} multiple={multiple} />;
}

// Timers reais (não vi.useFakeTimers) - o debounce é só 300ms e o findBy*/waitFor
// do testing-library já fazem polling, mais simples do que orquestrar fake timers com userEvent.
describe("PeoplePicker", () => {
  it("pesquisa com debounce e mostra os resultados", async () => {
    const search = vi.fn().mockResolvedValue([ANA, BRUNO]);
    render(<Controlled search={search} />);

    await userEvent.type(screen.getByRole("combobox"), "an");
    expect(search).not.toHaveBeenCalled();

    await waitFor(() => expect(search).toHaveBeenCalledWith("an"));
    expect(await screen.findByText("Ana Silva")).toBeInTheDocument();
    expect(screen.getByText("Bruno Costa")).toBeInTheDocument();
  });

  it('mostra "Sem resultados" quando a pesquisa não devolve ninguém', async () => {
    const search = vi.fn().mockResolvedValue([]);
    render(<Controlled search={search} />);

    await userEvent.type(screen.getByRole("combobox"), "zzz");
    expect(await screen.findByText('Sem resultados para "zzz"')).toBeInTheDocument();
  });

  it("seleccionar uma pessoa adiciona-a e limpa a pesquisa", async () => {
    const search = vi.fn().mockResolvedValue([ANA]);
    render(<Controlled search={search} />);

    await userEvent.type(screen.getByRole("combobox"), "ana");
    await userEvent.click(await screen.findByRole("option", { name: /Ana Silva/ }));

    expect(screen.getByText("Ana Silva")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveValue("");
  }, 10000);

  it("remover uma pessoa seleccionada tira-a da lista", async () => {
    const search = vi.fn().mockResolvedValue([ANA]);
    render(<Controlled search={search} />);

    await userEvent.type(screen.getByRole("combobox"), "ana");
    await userEvent.click(await screen.findByRole("option", { name: /Ana Silva/ }));
    await userEvent.click(screen.getByRole("button", { name: "Remover Ana Silva" }));

    expect(screen.queryByText("Ana Silva")).not.toBeInTheDocument();
  }, 10000);

  it("já não oferece nos resultados quem já está seleccionado", async () => {
    const search = vi.fn().mockResolvedValue([ANA, BRUNO]);
    render(<Controlled search={search} />);

    await userEvent.type(screen.getByRole("combobox"), "a");
    await userEvent.click(await screen.findByRole("option", { name: /Ana Silva/ }));

    await userEvent.type(screen.getByRole("combobox"), "a");
    await waitFor(() => expect(screen.getByRole("option", { name: /Bruno Costa/ })).toBeInTheDocument());
    expect(screen.queryByRole("option", { name: /Ana Silva/ })).not.toBeInTheDocument();
  }, 10000);

  it("com multiple=false, o campo de pesquisa desaparece assim que há 1 pessoa seleccionada", async () => {
    const search = vi.fn().mockResolvedValue([ANA]);
    render(<Controlled search={search} multiple={false} />);

    await userEvent.type(screen.getByRole("combobox"), "ana");
    await userEvent.click(await screen.findByRole("option", { name: /Ana Silva/ }));

    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  }, 10000);
});
