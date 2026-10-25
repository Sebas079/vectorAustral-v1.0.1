import { z } from "zod";

import { answerBot } from "@/lib/bot/botEngine";
import { getSheetKnowledgeEntries } from "@/lib/googleSheets/knowledgeService";
import { isRequestOriginAllowed } from "@/lib/security/origin";

const ChatRequestSchema = z.strictObject({
  message: z.string().trim().min(1).max(2000),
});

function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin || !isRequestOriginAllowed(request.headers)) {
    return false;
  }

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return Response.json({ error: "Origin not allowed" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  const parsed = ChatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  const pricingResponse = answerBot(parsed.data.message, []);
  if (pricingResponse.intent === "pricing") {
    return Response.json({ message: pricingResponse.message });
  }

  try {
    const knowledgeEntries = await getSheetKnowledgeEntries();
    const response = answerBot(parsed.data.message, knowledgeEntries);
    return Response.json({ message: response.message });
  } catch {
    console.error("Vector Uno knowledge lookup failed.");
    return Response.json(
      { error: "Knowledge service unavailable" },
      { status: 503 },
    );
  }
}
