import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("google-auth-library", () => ({
  GoogleAuth: class {
    async getAccessToken() {
      return "test-access-token";
    }
  },
}));

import {
  appendSheetValues,
  readSheetValues,
  updateSheetValues,
} from "../lib/googleSheets/client";

const account = JSON.stringify({
  type: "service_account",
  project_id: "test-project",
  client_email: "sheets@test-project.iam.gserviceaccount.com",
  private_key: "test-private-key",
});

describe("Google Sheets client", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubEnv("GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON", account);
    vi.stubEnv("GOOGLE_SHEETS_SPREADSHEET_ID", "test-spreadsheet-id");
  });

  it("reads values from Sheets with a server-side token and without caching", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      Response.json({
        values: [
          ["id", "response"],
          ["web", "Answer"],
        ],
      }),
    );

    await expect(readSheetValues("Knowledge!A:E")).resolves.toEqual([
      ["id", "response"],
      ["web", "Answer"],
    ]);
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain(
      "/values/Knowledge!A%3AE",
    );
    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({
      method: "GET",
      cache: "no-store",
      headers: { Authorization: "Bearer test-access-token" },
    });
  });

  it("appends lead values as raw rows", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(Response.json({ updates: { updatedRows: 1 } }));

    await appendSheetValues("Leads!A:H", [["lead-1", "Ana"]]);

    expect(String(fetchMock.mock.calls[0]?.[0])).toContain(
      "valueInputOption=RAW",
    );
    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({
      method: "POST",
      body: JSON.stringify({ values: [["lead-1", "Ana"]] }),
    });
  });

  it("updates an existing lead row", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(Response.json({ updatedCells: 8 }));

    await updateSheetValues("Leads!A2:H2", [["lead-1", "Ana"]]);

    expect(String(fetchMock.mock.calls[0]?.[0])).toContain(
      "/values/Leads!A2%3AH2?valueInputOption=RAW",
    );
    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({ method: "PUT" });
  });

  it("reports a failed Sheets response without treating it as success", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(null, { status: 403 }),
    );

    await expect(readSheetValues("Leads!A:H")).rejects.toThrow(
      "Google Sheets API respondió con estado 403.",
    );
  });

  it("rejects a missing spreadsheet ID before making a request", async () => {
    vi.stubEnv("GOOGLE_SHEETS_SPREADSHEET_ID", "");
    const fetchMock = vi.spyOn(globalThis, "fetch");

    await expect(readSheetValues("Leads!A:H")).rejects.toThrow(
      "Falta GOOGLE_SHEETS_SPREADSHEET_ID.",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
