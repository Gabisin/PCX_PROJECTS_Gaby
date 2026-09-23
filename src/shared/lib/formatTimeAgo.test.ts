import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { formatTimeAgo } from "./formatTimeAgo";

describe("formatTimeAgo", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-10T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('devolve "Agora mesmo" para instantes há menos de 1 minuto', () => {
    expect(formatTimeAgo(new Date("2026-03-10T11:59:30Z"))).toBe("Agora mesmo");
  });

  it("devolve minutos para instantes há menos de 1 hora", () => {
    expect(formatTimeAgo(new Date("2026-03-10T11:45:00Z"))).toBe("Há 15min");
  });

  it("devolve horas para instantes há menos de 24 horas", () => {
    expect(formatTimeAgo(new Date("2026-03-10T09:00:00Z"))).toBe("Há 3h");
  });

  it('devolve "Ontem" para exactamente 1 dia', () => {
    expect(formatTimeAgo(new Date("2026-03-09T12:00:00Z"))).toBe("Ontem");
  });

  it("devolve dias para mais de 1 dia", () => {
    expect(formatTimeAgo(new Date("2026-03-05T12:00:00Z"))).toBe("Há 5 dias");
  });

  it("aceita uma string ISO tal como aceita um Date", () => {
    expect(formatTimeAgo("2026-03-10T11:45:00Z")).toBe("Há 15min");
  });
});
