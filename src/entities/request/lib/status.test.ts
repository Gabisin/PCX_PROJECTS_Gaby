import { describe, it, expect } from "vitest";
import { REQUEST_STATUS_OPTIONS, getRequestStatusOption } from "./status";

describe("getRequestStatusOption", () => {
  it("devolve a opção (label + tone) correspondente a um status conhecido", () => {
    expect(getRequestStatusOption("approved")).toEqual({ value: "approved", label: "Aprovado", tone: "success" });
  });

  it("cobre todos os status listados em REQUEST_STATUS_OPTIONS", () => {
    for (const option of REQUEST_STATUS_OPTIONS) {
      expect(getRequestStatusOption(option.value)).toBe(option);
    }
  });

  it("nunca devolve undefined - cai para a primeira opção num status desconhecido", () => {
    // @ts-expect-error - a testar robustez contra dados vindos de uma API real
    expect(getRequestStatusOption("estado_que_nao_existe")).toBe(REQUEST_STATUS_OPTIONS[0]);
  });
});
