import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

import { isRequestOriginAllowed } from "@/lib/security/origin";

const VectorUnoSchema = z.strictObject({
  userId: z.string().max(128).optional(),
  message: z.string().trim().min(1).max(2000),
});

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isRequestOriginAllowed(request.headers)) {
    return NextResponse.json({ error: "Origin not allowed" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const parsed = VectorUnoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const webhook = process.env.VECTORUNO_WEBHOOK_URL;
  if (!webhook) {
    console.error("VECTORUNO_WEBHOOK_URL is not configured.");
    return NextResponse.json(
      { error: "Vector Uno service unavailable" },
      { status: 503 },
    );
  }

  const serializedPayload = JSON.stringify({
    ...parsed.data,
    receivedAt: new Date().toISOString(),
  });
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const webhookSecret = process.env.VECTORUNO_WEBHOOK_SECRET;
  if (webhookSecret) {
    headers["x-vector-signature"] = createHmac("sha256", webhookSecret)
      .update(serializedPayload)
      .digest("hex");
  }

  try {
    const webhookResponse = await fetch(webhook, {
      method: "POST",
      headers,
      body: serializedPayload,
      signal: AbortSignal.timeout(8_000),
      cache: "no-store",
    });
    if (!webhookResponse.ok) {
      console.error("Vector Uno webhook responded with a non-success status.");
      return NextResponse.json(
        { error: "Vector Uno service unavailable" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Vector Uno webhook request failed:", error);
    return NextResponse.json(
      { error: "Vector Uno service unavailable" },
      { status: 502 },
    );
  }
}
