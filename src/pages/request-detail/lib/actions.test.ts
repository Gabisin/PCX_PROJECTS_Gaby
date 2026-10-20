import { describe, it, expect } from "vitest";
import { getAvailableActions } from "./actions";

function keys(status: Parameters<typeof getAvailableActions>[0]) {
  return getAvailableActions(status).map((a) => a.key);
}

describe("getAvailableActions", () => {
  it("draft só pode ser submetido", () => {
    expect(keys("draft")).toEqual(["submit"]);
  });

  it("submitted/in_review/awaiting_info têm as mesmas 4 acções (aprovar, pedir info, rejeitar, cancelar)", () => {
    const expected = ["approve", "request_info", "reject", "cancel"];
    expect(keys("submitted")).toEqual(expected);
    expect(keys("in_review")).toEqual(expected);
    expect(keys("awaiting_info")).toEqual(expected);
  });

  it("approved só pode ser concluído ou cancelado - já não pode voltar a rejeitar", () => {
    expect(keys("approved")).toEqual(["complete", "cancel"]);
  });

  it("estados terminais (completed/rejected/cancelled) não têm acções de avanço", () => {
    expect(getAvailableActions("completed")).toEqual([]);
    expect(getAvailableActions("rejected")).toEqual([]);
    expect(getAvailableActions("cancelled")).toEqual([]);
  });

  it("aprovar tem motivo opcional (não required)", () => {
    const approve = getAvailableActions("submitted").find((a) => a.key === "approve");
    expect(approve?.reason?.required).toBeFalsy();
  });

  it("rejeitar, cancelar e pedir informação exigem sempre motivo", () => {
    for (const key of ["reject", "cancel", "request_info"]) {
      const action = getAvailableActions("submitted").find((a) => a.key === key);
      expect(action?.reason?.required).toBe(true);
      expect(action?.reason?.requiredError).toBeTruthy();
    }
  });

  it("acções destrutivas (rejeitar, cancelar) têm tone=destructive; as restantes tone=default", () => {
    const actions = getAvailableActions("submitted");
    expect(actions.find((a) => a.key === "reject")?.tone).toBe("destructive");
    expect(actions.find((a) => a.key === "cancel")?.tone).toBe("destructive");
    expect(actions.find((a) => a.key === "approve")?.tone).toBe("default");
    expect(actions.find((a) => a.key === "request_info")?.tone).toBe("default");
  });
});
