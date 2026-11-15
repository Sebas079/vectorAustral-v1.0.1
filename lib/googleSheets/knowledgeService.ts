import "server-only";

import { z } from "zod";

import type { KnowledgeEntry } from "@/lib/bot/knowledgeBase";
import { readSheetValues } from "./client";

const KNOWLEDGE_RANGE = "Knowledge!A:E";
const KNOWLEDGE_HEADERS = ["id", "title", "keywords", "response", "active"];
const knowledgeRowSchema = z.tuple([
  z.string().min(1),
  z.string().min(1),
  z.string().min(1),
  z.string().min(1),
  z.enum(["true", "false"]),
]);

function cellToString(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (value === null || value === undefined) {
    return "";
  }
  throw new Error("La hoja Knowledge contiene una celda con formato inválido.");
}

export async function getSheetKnowledgeEntries(): Promise<KnowledgeEntry[]> {
  const rows = await readSheetValues(KNOWLEDGE_RANGE);
  if (
    !rows[0] ||
    KNOWLEDGE_HEADERS.some((header, index) => rows[0][index] !== header)
  ) {
    throw new Error("La pestaña Knowledge no tiene los encabezados esperados.");
  }

  return rows.slice(1).flatMap((row, index) => {
    if (row.every((cell) => cell === "" || cell === null)) {
      return [];
    }

    const normalizedRow = Array.from({ length: 5 }, (_, column) =>
      cellToString(row[column]),
    );
    normalizedRow[4] = normalizedRow[4].toLowerCase();
    const parsedRow = knowledgeRowSchema.safeParse(normalizedRow);
    if (!parsedRow.success) {
      throw new Error(
        `La fila ${index + 2} de Knowledge tiene un formato inválido.`,
        { cause: parsedRow.error },
      );
    }

    const [id, title, serializedKeywords, response, active] = parsedRow.data;
    if (active !== "true") {
      return [];
    }

    const keywords = serializedKeywords
      .split(",")
      .map((keyword) => keyword.trim().toLocaleLowerCase("es-AR"))
      .filter(Boolean);
    if (keywords.length === 0) {
      throw new Error(
        `La fila ${index + 2} de Knowledge no tiene palabras clave.`,
      );
    }

    return [{ id, title, keywords, response }];
  });
}
