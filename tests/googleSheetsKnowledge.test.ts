import { beforeEach, describe, expect, it, vi } from "vitest";

const { readSheetValuesMock } = vi.hoisted(() => ({
  readSheetValuesMock: vi.fn(),
}));

vi.mock("../lib/googleSheets/client", () => ({
  readSheetValues: readSheetValuesMock,
}));

import { getSheetKnowledgeEntries } from "../lib/googleSheets/knowledgeService";

describe("Google Sheets knowledge service", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns active knowledge entries with normalized keywords", async () => {
    readSheetValuesMock.mockResolvedValueOnce([
      ["id", "title", "keywords", "response", "active"],
      ["web", "Desarrollo web", "web, plataforma", "Respuesta vigente", "TRUE"],
      ["old", "Desactivado", "web", "Respuesta vieja", "FALSE"],
    ]);

    await expect(getSheetKnowledgeEntries()).resolves.toEqual([
      {
        id: "web",
        title: "Desarrollo web",
        keywords: ["web", "plataforma"],
        response: "Respuesta vigente",
      },
    ]);
  });

  it("returns an empty list when the knowledge sheet has only its header", async () => {
    readSheetValuesMock.mockResolvedValueOnce([
      ["id", "title", "keywords", "response", "active"],
    ]);

    await expect(getSheetKnowledgeEntries()).resolves.toEqual([]);
  });

  it("rejects a Knowledge tab with missing headers", async () => {
    readSheetValuesMock.mockResolvedValueOnce([["id", "response"]]);

    await expect(getSheetKnowledgeEntries()).rejects.toThrow(
      "La pestaña Knowledge no tiene los encabezados esperados.",
    );
  });

  it("rejects an active row without a response", async () => {
    readSheetValuesMock.mockResolvedValueOnce([
      ["id", "title", "keywords", "response", "active"],
      ["web", "Desarrollo web", "web", "", "TRUE"],
    ]);

    await expect(getSheetKnowledgeEntries()).rejects.toThrow(
      "La fila 2 de Knowledge tiene un formato inválido.",
    );
  });
});
