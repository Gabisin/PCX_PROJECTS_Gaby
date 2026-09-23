import { describe, it, expect } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("junta classes truthy com espaço", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("ignora valores falsy", () => {
    expect(cn("a", false, undefined, null, "c")).toBe("a c");
  });

  it("resolve conflitos do Tailwind mantendo a última classe (tailwind-merge)", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});
