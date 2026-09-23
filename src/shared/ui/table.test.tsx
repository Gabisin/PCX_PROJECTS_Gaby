import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Table, TableBody, TableRow, TableCell, TableEmptyState } from "./table";

describe("TableEmptyState", () => {
  it("mostra a mensagem passada, ocupando todas as colunas via colSpan", () => {
    render(
      <Table>
        <TableBody>
          <TableEmptyState colSpan={4} message="Sem resultados" />
        </TableBody>
      </Table>
    );
    const cell = screen.getByText("Sem resultados").closest("td");
    expect(cell).toHaveAttribute("colspan", "4");
  });
});

describe("Table", () => {
  it("renderiza linhas e células normalmente dentro da tabela", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>REQ-001</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getByText("REQ-001")).toBeInTheDocument();
  });
});
