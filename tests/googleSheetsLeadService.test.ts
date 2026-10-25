import { beforeEach, describe, expect, it, vi } from "vitest";

const { appendSheetValuesMock, readSheetValuesMock, updateSheetValuesMock } =
  vi.hoisted(() => ({
    appendSheetValuesMock: vi.fn(),
    readSheetValuesMock: vi.fn(),
    updateSheetValuesMock: vi.fn(),
  }));

vi.mock("../lib/googleSheets/client", () => ({
  appendSheetValues: appendSheetValuesMock,
  readSheetValues: readSheetValuesMock,
  updateSheetValues: updateSheetValuesMock,
}));

import {
  findSheetLeadByContact,
  LeadContactConflictError,
  saveSheetLead,
} from "../lib/googleSheets/leadService";

const header = [
  "id",
  "fullName",
  "email",
  "phone",
  "isClient",
  "consultationHistory",
  "createdAt",
  "updatedAt",
];
const input = {
  fullName: "Ana Gómez",
  email: "ana@example.com",
  phone: "+54 9 11 5555-1234",
  reason: "Automatizar consultas.",
};
const previousLead = [
  "lead-1",
  "Ana Gómez",
  input.email,
  input.phone,
  "false",
  JSON.stringify([
    {
      reason: "Primera consulta.",
      timestamp: "2026-10-20T12:00:00.000Z",
      source: "landing_form",
    },
  ]),
  "2026-10-20T12:00:00.000Z",
  "2026-10-20T12:00:00.000Z",
];

describe("Google Sheets lead service", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    readSheetValuesMock.mockResolvedValue([header]);
    appendSheetValuesMock.mockResolvedValue(undefined);
    updateSheetValuesMock.mockResolvedValue(undefined);
  });

  it("creates a lead when the sheet only contains its header", async () => {
    const created = await saveSheetLead(
      input,
      new Date("2026-10-25T12:00:00.000Z"),
    );

    expect(created).toMatchObject({
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      consultationHistory: [
        {
          reason: input.reason,
          timestamp: "2026-10-25T12:00:00.000Z",
          source: "landing_form",
        },
      ],
    });
    expect(appendSheetValuesMock).toHaveBeenCalledWith("Leads!A:H", [
      expect.arrayContaining([
        expect.any(String),
        input.fullName,
        input.email,
        input.phone,
      ]),
    ]);
  });

  it("rejects a Leads tab without the documented column headers", async () => {
    readSheetValuesMock.mockResolvedValueOnce([["fullName", "email"]]);

    await expect(saveSheetLead(input)).rejects.toThrow(
      "La pestaña Leads no tiene los encabezados esperados.",
    );
    expect(appendSheetValuesMock).not.toHaveBeenCalled();
  });

  it("updates a matching lead and appends its consultation history", async () => {
    readSheetValuesMock.mockResolvedValueOnce([header, previousLead]);

    const updated = await saveSheetLead(
      { ...input, fullName: "Ana Gómez P." },
      new Date("2026-10-25T12:00:00.000Z"),
    );

    expect(updated.id).toBe("lead-1");
    expect(updated.fullName).toBe("Ana Gómez P.");
    expect(updated.consultationHistory).toHaveLength(2);
    expect(updateSheetValuesMock).toHaveBeenCalledWith("Leads!A2:H2", [
      expect.arrayContaining([
        "lead-1",
        "Ana Gómez P.",
        input.email,
        input.phone,
      ]),
    ]);
  });

  it("rejects contacts that point to different leads", async () => {
    readSheetValuesMock.mockResolvedValueOnce([
      header,
      previousLead,
      [
        "lead-2",
        "Otra persona",
        "otra@example.com",
        input.phone,
        "false",
        "[]",
        "2026-10-20T12:00:00.000Z",
        "2026-10-20T12:00:00.000Z",
      ],
    ]);

    await expect(saveSheetLead(input)).rejects.toBeInstanceOf(
      LeadContactConflictError,
    );
    expect(appendSheetValuesMock).not.toHaveBeenCalled();
    expect(updateSheetValuesMock).not.toHaveBeenCalled();
  });

  it("recognizes a lead only when both contact details match the same record", async () => {
    readSheetValuesMock.mockResolvedValueOnce([header, previousLead]);

    await expect(
      findSheetLeadByContact(input.email, input.phone),
    ).resolves.toMatchObject({ id: "lead-1", fullName: "Ana Gómez" });

    readSheetValuesMock.mockResolvedValueOnce([header, previousLead]);
    await expect(
      findSheetLeadByContact(input.email, "+54 9 11 5555-0000"),
    ).resolves.toBeNull();
  });
});
