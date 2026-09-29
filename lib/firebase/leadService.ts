import "server-only";

import { type Firestore } from "firebase-admin/firestore";
import { getAdminFirestore } from "./admin";
import type { LeadInput } from "../validators/leadSchema";

export interface ConsultationEntry {
  reason: string;
  timestamp: string;
  source: "landing_form" | "bot_redirect";
}

export interface LeadDocument {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  isClient: boolean;
  consultationHistory: ConsultationEntry[];
  createdAt: string;
  updatedAt: string;
}

type PersistedLead = Omit<LeadDocument, "id">;

function toFirestoreData(lead: LeadDocument | PersistedLead) {
  return {
    fullName: lead.fullName,
    email: lead.email,
    phone: lead.phone,
    isClient: lead.isClient,
    consultationHistory: lead.consultationHistory,
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
  };
}

export interface LeadStore {
  findByEmailAndPhone(
    email: string,
    phone: string,
  ): Promise<LeadDocument | null>;
  findByEmailOrPhone(
    email: string,
    phone: string,
  ): Promise<LeadDocument | null>;
  create(lead: PersistedLead): Promise<LeadDocument>;
  update(id: string, lead: LeadDocument): Promise<LeadDocument>;
}

export class LeadContactConflictError extends Error {
  constructor() {
    super(
      "El email y el teléfono pertenecen a leads diferentes; se requiere revisión manual.",
    );
    this.name = "LeadContactConflictError";
  }
}

function createFirestoreLeadStore(db: Firestore): LeadStore {
  const leadsCollection = db.collection("leads");

  return {
    async findByEmailAndPhone(email, phone) {
      const [emailSnapshot, phoneSnapshot] = await Promise.all([
        leadsCollection.where("email", "==", email).limit(1).get(),
        leadsCollection.where("phone", "==", phone).limit(1).get(),
      ]);
      const emailLead = emailSnapshot.docs[0];
      const phoneLead = phoneSnapshot.docs[0];

      if (!emailLead || emailLead.id !== phoneLead?.id) {
        return null;
      }

      return { id: emailLead.id, ...emailLead.data() } as LeadDocument;
    },

    async findByEmailOrPhone(email, phone) {
      const [emailSnapshot, phoneSnapshot] = await Promise.all([
        leadsCollection.where("email", "==", email).limit(1).get(),
        leadsCollection.where("phone", "==", phone).limit(1).get(),
      ]);
      const matches = new Map<string, LeadDocument>();

      for (const snapshot of [emailSnapshot, phoneSnapshot]) {
        for (const lead of snapshot.docs) {
          matches.set(lead.id, { id: lead.id, ...lead.data() } as LeadDocument);
        }
      }

      if (matches.size > 1) {
        throw new LeadContactConflictError();
      }

      return matches.values().next().value ?? null;
    },

    async create(lead) {
      const reference = await leadsCollection.add(toFirestoreData(lead));
      return { ...lead, id: reference.id };
    },

    async update(id, lead) {
      await leadsCollection.doc(id).update(toFirestoreData(lead));
      return lead;
    },
  };
}

export async function saveLead(
  input: LeadInput,
  store: LeadStore = createFirestoreLeadStore(getAdminFirestore()),
  now: Date = new Date(),
): Promise<LeadDocument> {
  const timestamp = now.toISOString();
  const existingLead = await store.findByEmailOrPhone(input.email, input.phone);
  const consultation: ConsultationEntry = {
    reason: input.reason,
    timestamp,
    source: "landing_form",
  };

  if (!existingLead) {
    const lead: PersistedLead = {
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      isClient: false,
      consultationHistory: [consultation],
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    return store.create(lead);
  }

  const updatedLead: LeadDocument = {
    ...existingLead,
    fullName: input.fullName,
    email: input.email,
    phone: input.phone,
    consultationHistory: [...existingLead.consultationHistory, consultation],
    updatedAt: timestamp,
  };

  return store.update(existingLead.id, updatedLead);
}

export async function findLeadByContact(
  email: string,
  phone: string,
  store: LeadStore = createFirestoreLeadStore(getAdminFirestore()),
): Promise<LeadDocument | null> {
  return store.findByEmailAndPhone(email, phone);
}
