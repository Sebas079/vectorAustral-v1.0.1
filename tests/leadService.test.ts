import { describe, expect, it, vi } from "vitest";

import type { LeadInput } from "../lib/validators/leadSchema";
import {
  type LeadDocument,
  type LeadStore,
  findLeadByContact,
  saveLead,
} from "../lib/firebase/leadService";

const validInput: LeadInput = {
  fullName: "Ana Gómez",
  phone: "+54 9 11 5555-1234",
  email: "ana@example.com",
  reason: "Necesito automatizar la gestión de consultas.",
};

function createStore(existingLead: LeadDocument | null = null): LeadStore {
  return {
    findByEmailAndPhone: vi.fn().mockResolvedValue(existingLead),
    findByEmailOrPhone: vi.fn().mockResolvedValue(existingLead),
    create: vi.fn(async (lead) => ({ ...lead, id: "lead-created" })),
    update: vi.fn(async (_id, lead) => lead),
  };
}

describe("saveLead", () => {
  it("creates a new lead with its first consultation", async () => {
    const store = createStore();
    const result = await saveLead(
      validInput,
      store,
      new Date("2026-09-20T12:00:00.000Z"),
    );

    expect(result).toMatchObject({
      id: "lead-created",
      fullName: validInput.fullName,
      email: validInput.email,
      phone: validInput.phone,
      isClient: false,
      createdAt: "2026-09-20T12:00:00.000Z",
      updatedAt: "2026-09-20T12:00:00.000Z",
    });
    expect(result.consultationHistory).toEqual([
      {
        reason: validInput.reason,
        timestamp: "2026-09-20T12:00:00.000Z",
        source: "landing_form",
      },
    ]);
    expect(store.create).toHaveBeenCalledOnce();
    expect(store.update).not.toHaveBeenCalled();
  });

  it("updates an existing lead and appends consultation history", async () => {
    const existingLead: LeadDocument = {
      id: "lead-existing",
      fullName: "Ana Gómez",
      email: validInput.email,
      phone: validInput.phone,
      isClient: true,
      consultationHistory: [
        {
          reason: "Consulta anterior.",
          timestamp: "2026-09-19T12:00:00.000Z",
          source: "landing_form",
        },
      ],
      createdAt: "2026-09-19T12:00:00.000Z",
      updatedAt: "2026-09-19T12:00:00.000Z",
    };
    const store = createStore(existingLead);

    const result = await saveLead(
      { ...validInput, reason: "Nueva consulta." },
      store,
      new Date("2026-09-20T12:00:00.000Z"),
    );

    expect(result.id).toBe("lead-existing");
    expect(result.isClient).toBe(true);
    expect(result.consultationHistory).toHaveLength(2);
    expect(result.consultationHistory[1]).toEqual({
      reason: "Nueva consulta.",
      timestamp: "2026-09-20T12:00:00.000Z",
      source: "landing_form",
    });
    expect(store.update).toHaveBeenCalledWith("lead-existing", result);
    expect(store.create).not.toHaveBeenCalled();
  });

  it("looks up an existing lead by email or phone", async () => {
    const store = createStore();

    await saveLead(validInput, store);

    expect(store.findByEmailOrPhone).toHaveBeenCalledWith(
      validInput.email,
      validInput.phone,
    );
  });

  it("recognizes a lead only when email and phone belong to the same record", async () => {
    const existingLead: LeadDocument = {
      id: "lead-existing",
      fullName: "Ana Gómez",
      email: validInput.email,
      phone: validInput.phone,
      isClient: false,
      consultationHistory: [],
      createdAt: "2026-09-19T12:00:00.000Z",
      updatedAt: "2026-09-19T12:00:00.000Z",
    };
    const store = createStore(existingLead);

    await expect(
      findLeadByContact(validInput.email, validInput.phone, store),
    ).resolves.toEqual(existingLead);
    expect(store.findByEmailAndPhone).toHaveBeenCalledWith(
      validInput.email,
      validInput.phone,
    );
  });
});
