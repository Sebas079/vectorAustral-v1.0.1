import "server-only";

import { GoogleAuth } from "google-auth-library";
import { z } from "zod";

const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const serviceAccountSchema = z.object({
  type: z.literal("service_account"),
  project_id: z.string().min(1),
  client_email: z.string().email(),
  private_key: z.string().min(1),
});
const valuesResponseSchema = z.object({
  values: z
    .array(z.array(z.union([z.string(), z.number(), z.boolean(), z.null()])))
    .optional(),
});

let googleAuth: GoogleAuth | undefined;

function getGoogleAuth() {
  if (googleAuth) {
    return googleAuth;
  }

  const serializedAccount = process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON;
  if (!serializedAccount) {
    throw new Error("Falta GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON.");
  }

  let account: unknown;
  try {
    account = JSON.parse(serializedAccount);
  } catch (error) {
    throw new Error(
      "GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON no contiene JSON válido.",
      { cause: error },
    );
  }

  const parsedAccount = serviceAccountSchema.safeParse(account);
  if (!parsedAccount.success) {
    throw new Error(
      "GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON debe contener una cuenta de servicio válida.",
      { cause: parsedAccount.error },
    );
  }

  googleAuth = new GoogleAuth({
    credentials: parsedAccount.data,
    scopes: [SHEETS_SCOPE],
  });

  return googleAuth;
}

function getSpreadsheetId() {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim();
  if (!spreadsheetId) {
    throw new Error("Falta GOOGLE_SHEETS_SPREADSHEET_ID.");
  }
  return spreadsheetId;
}

async function requestSheetApi(
  range: string,
  method: "GET" | "POST" | "PUT",
  values?: string[][],
): Promise<unknown> {
  const spreadsheetId = getSpreadsheetId();
  const token = await getGoogleAuth().getAccessToken();
  if (!token) {
    throw new Error("Google no pudo emitir un token de acceso.");
  }

  const operation = method === "POST" ? ":append" : "";
  const url = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}${operation}`,
  );

  if (method === "POST") {
    url.searchParams.set("valueInputOption", "RAW");
    url.searchParams.set("insertDataOption", "INSERT_ROWS");
  } else if (method === "PUT") {
    url.searchParams.set("valueInputOption", "RAW");
  }

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(values ? { "Content-Type": "application/json" } : {}),
    },
    ...(values ? { body: JSON.stringify({ values }) } : {}),
    signal: AbortSignal.timeout(8_000),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Google Sheets API respondió con estado ${response.status}.`,
    );
  }

  return response.json();
}

export async function readSheetValues(range: string) {
  const payload = await requestSheetApi(range, "GET");
  const parsed = valuesResponseSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("Google Sheets devolvió datos con un formato inválido.", {
      cause: parsed.error,
    });
  }
  return parsed.data.values ?? [];
}

export async function appendSheetValues(range: string, values: string[][]) {
  await requestSheetApi(range, "POST", values);
}

export async function updateSheetValues(range: string, values: string[][]) {
  await requestSheetApi(range, "PUT", values);
}
