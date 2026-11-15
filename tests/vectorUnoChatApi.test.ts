import { beforeEach, describe, expect, it, vi } from "vitest";

const { getKnowledgeEntriesMock } = vi.hoisted(() => ({
  getKnowledgeEntriesMock: vi.fn(),
}));

vi.mock("../lib/googleSheets/knowledgeService", () => ({
  getSheetKnowledgeEntries: getKnowledgeEntriesMock,
}));

import { POST } from "../app/api/vectoruno/chat/route";

function createRequest(body: unknown) {
  return new Request("http://localhost/api/vectoruno/chat", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "http://localhost",
    },
    body: JSON.stringify(body),
  });
}

describe("Vector Uno chat API", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("ALLOWED_ORIGINS", "");
    getKnowledgeEntriesMock.mockResolvedValue([
      {
        id: "web",
        title: "Desarrollo web",
        keywords: ["web"],
        response: "Respuesta vigente desde Sheets.",
      },
    ]);
  });

  it("answers with the current knowledge read from Sheets", async () => {
    const response = await POST(createRequest({ message: "web" }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      message: "Respuesta vigente desde Sheets.",
    });
    expect(getKnowledgeEntriesMock).toHaveBeenCalledOnce();
  });

  it("does not query Sheets to reject automatic pricing", async () => {
    const response = await POST(
      createRequest({ message: "¿Cuánto cuesta una web?" }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      message:
        "No realizo presupuestos automáticos. Solicita un Diagnóstico Inicial y un especialista te cotiza según tus requerimientos.",
    });
    expect(getKnowledgeEntriesMock).not.toHaveBeenCalled();
  });

  it("rejects unexpected request properties", async () => {
    const response = await POST(
      createRequest({ message: "web", conversation: ["un dato personal"] }),
    );

    expect(response.status).toBe(400);
    expect(getKnowledgeEntriesMock).not.toHaveBeenCalled();
  });

  it("rejects requests from another origin", async () => {
    const response = await POST(
      new Request("http://localhost/api/vectoruno/chat", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: "https://otro-sitio.example",
        },
        body: JSON.stringify({ message: "web" }),
      }),
    );

    expect(response.status).toBe(403);
    expect(getKnowledgeEntriesMock).not.toHaveBeenCalled();
  });

  it("reports unavailable knowledge rather than pretending to answer", async () => {
    getKnowledgeEntriesMock.mockRejectedValueOnce(new Error("sheets offline"));
    const response = await POST(createRequest({ message: "web" }));

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      error: "Knowledge service unavailable",
    });
  });
});
