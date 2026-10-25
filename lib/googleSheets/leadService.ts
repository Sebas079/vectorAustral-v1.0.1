import "server-only";

import { randomUUID } from "node:crypto";
import { z } from "zod";

import type {
  ConsultationEntry,
  LeadDocument,
} from "@/lib/firebase/leadService";
import type { LeadInput } from "@/lib/validators/leadSchema";
import {
  appendSheetValues,
  readSheetValues,
  updateSheetValues,
} from "./client";

const LEADS_RANGE = "Leads!A:H";
const LEAD_HEADERS = [
  "id",
  "fullName",
  "email",
  "phone",
  "isClient",
  "consultationHistory",
  "createdAt",
  "updatedAt",
];
const CONSULTATION_SCHEMA = z.object({
  reason: z.string(),
  timestamp: z.string(),
  source: z.enum(["landing_form", "bot_redirect"]),
});
const leadRowSchema = z.tuple([
  z.string().min(1),
  z.string(),
  z.string(),
  z.string(),
  z.string(),
  z.string(),
  z.string(),
  z.string(),
]);

interface StoredLead {
  lead: LeadDocument;
  rowNumber: number;
}

export class LeadContactConflictError extends Error {
  constructor() {
    super(
      "El email y el teléfono pertenecen a registros diferentes; se requiere revisión manual.",
    );
    this.name = "LeadContactConflictError";
  }
}

function parseLeadRow(row: unknown[], rowNumber: number): StoredLead {
  const normalizedRow = Array.from({ length: 8 }, (_, index) => {
    const value = row[index];
    if (typeof value === "string") {
      return value;
    }
    if (typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }
    return "";
  });
  const parsedRow = leadRowSchema.safeParse(normalizedRow);
  if (!parsedRow.success) {
    throw new Error(
      `La fila ${rowNumber} de Leads tiene un formato inválido.`,
      {
        cause: parsedRow.error,
      },
    );
  }

  let consultationHistory: unknown;
  try {
    consultationHistory = JSON.parse(parsedRow.data[5]);
  } catch (error) {
    throw new Error(
      `El historial de la fila ${rowNumber} de Leads no contiene JSON válido.`,
      { cause: error },
    );
  }

  const parsedHistory = z
    .array(CONSULTATION_SCHEMA)
    .safeParse(consultationHistory);
  if (!parsedHistory.success) {
    throw new Error(
      `El historial de la fila ${rowNumber} de Leads tiene un formato inválido.`,
      { cause: parsedHistory.error },
    );
  }

  const [id, fullName, email, phone, isClient, , createdAt, updatedAt] =
    parsedRow.data;
  const lead: LeadDocument = {
    id,
    fullName,
    email,
    phone,
    isClient: isClient.toLowerCase() === "true",
    consultationHistory: parsedHistory.data,
    createdAt,
    updatedAt,
  };

  return { lead, rowNumber };
}

async function getStoredLeads(): Promise<StoredLead[]> {
  const rows = await readSheetValues(LEADS_RANGE);
  if (
    !rows[0] ||
    LEAD_HEADERS.some((header, index) => rows[0][index] !== header)
  ) {
    throw new Error("La pestaña Leads no tiene los encabezados esperados.");
  }
  return rows.slice(1).flatMap((row, index) => {
    if (row.every((cell) => cell === "" || cell === null)) {
      return [];
    }
    return [parseLeadRow(row, index + 2)];
  });
}

function findContactMatch(
  leads: StoredLead[],
  email: string,
  phone: string,
  requireBoth = false,
): StoredLead | null {
  const emailMatches = leads.filter(({ lead }) => lead.email === email);
  const phoneMatches = leads.filter(({ lead }) => lead.phone === phone);

  if (requireBoth) {
    if (emailMatches.length > 1 || phoneMatches.length > 1) {
      throw new LeadContactConflictError();
    }
    return emailMatches[0]?.lead.id === phoneMatches[0]?.lead.id
      ? (emailMatches[0] ?? null)
      : null;
  }

  const matches = new Map(
    [...emailMatches, ...phoneMatches].map((storedLead) => [
      storedLead.lead.id,
      storedLead,
    ]),
  );

  if (matches.size > 1 || emailMatches.length > 1 || phoneMatches.length > 1) {
    throw new LeadContactConflictError();
  }

  return matches.values().next().value ?? null;
}

function toSheetRow(lead: LeadDocument): string[] {
  return [
    lead.id,
    lead.fullName,
    lead.email,
    lead.phone,
    String(lead.isClient),
    JSON.stringify(lead.consultationHistory),
    lead.createdAt,
    lead.updatedAt,
  ];
}

export async function saveSheetLead(
  input: LeadInput,
  now = new Date(),
): Promise<LeadDocument> {
  const storedLeads = await getStoredLeads();
  const existing = findContactMatch(storedLeads, input.email, input.phone);
  const timestamp = now.toISOString();
  const consultation: ConsultationEntry = {
    reason: input.reason,
    timestamp,
    source: "landing_form",
  };

  if (!existing) {
    const lead: LeadDocument = {
      id: randomUUID(),
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      isClient: false,
      consultationHistory: [consultation],
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    await appendSheetValues(LEADS_RANGE, [toSheetRow(lead)]);
    return lead;
  }

  const updatedLead: LeadDocument = {
    ...existing.lead,
    fullName: input.fullName,
    email: input.email,
    phone: input.phone,
    consultationHistory: [...existing.lead.consultationHistory, consultation],
    updatedAt: timestamp,
  };
  await updateSheetValues(
    `Leads!A${existing.rowNumber}:H${existing.rowNumber}`,
    [toSheetRow(updatedLead)],
  );
  return updatedLead;
}

export async function findSheetLeadByContact(
  email: string,
  phone: string,
): Promise<LeadDocument | null> {
  const storedLeads = await getStoredLeads();
  return findContactMatch(storedLeads, email, phone, true)?.lead ?? null;
}
