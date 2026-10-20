import { describe, it, expect } from "vitest";
import { MOCK_REQUESTS, getMockRequestById } from "./mock";

describe("getMockRequestById", () => {
  it("devolve o pedido cujo id corresponde", () => {
    const request = getMockRequestById("1");
    expect(request?.number).toBe("REQ-2026-001");
  });

  it("devolve undefined para um id inexistente", () => {
    expect(getMockRequestById("id-que-nao-existe")).toBeUndefined();
  });

  it("cada pedido mock tem um número único", () => {
    const numbers = MOCK_REQUESTS.map((r) => r.number);
    expect(new Set(numbers).size).toBe(numbers.length);
  });
});
