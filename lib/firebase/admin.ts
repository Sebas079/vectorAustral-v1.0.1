import "server-only";

import { z } from "zod";
import {
  cert,
  getApps,
  initializeApp,
  type ServiceAccount,
} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccountSchema = z.object({
  project_id: z.string().min(1),
  client_email: z.string().email(),
  private_key: z.string().min(1),
});

function getServiceAccount(): ServiceAccount {
  const serializedAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (!serializedAccount) {
    throw new Error("Falta FIREBASE_SERVICE_ACCOUNT_JSON.");
  }

  let serializedAccountObject: unknown;
  try {
    serializedAccountObject = JSON.parse(serializedAccount);
  } catch (error) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON no contiene JSON válido.", {
      cause: error,
    });
  }

  const parsedAccount = serviceAccountSchema.safeParse(serializedAccountObject);
  if (!parsedAccount.success) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_JSON debe incluir project_id, client_email y private_key.",
      { cause: parsedAccount.error },
    );
  }

  return {
    projectId: parsedAccount.data.project_id,
    clientEmail: parsedAccount.data.client_email,
    privateKey: parsedAccount.data.private_key,
  };
}

export function getAdminFirestore() {
  const existingApp = getApps()[0];
  const app =
    existingApp ??
    initializeApp({
      credential: cert(getServiceAccount()),
    });

  return getFirestore(app);
}
