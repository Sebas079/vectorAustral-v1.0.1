import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const TOKENS = ["#0a1128", "#00e5ff", "#0d131f", "#1e293b"];

describe("T1 baseline", () => {
  it("exposes the Vector Austral palette in globals.css", () => {
    const css = readFileSync(
      join(__dirname, "..", "app", "globals.css"),
      "utf8",
    ).toLowerCase();
    for (const token of TOKENS) {
      expect(css).toContain(token);
    }
  });

  it("enforces TypeScript strict mode", () => {
    const tsconfig = JSON.parse(
      readFileSync(join(__dirname, "..", "tsconfig.json"), "utf8"),
    ) as { compilerOptions?: { strict?: boolean } };
    expect(tsconfig.compilerOptions?.strict).toBe(true);
  });
});
