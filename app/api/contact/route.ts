import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getSubmissionRetryAfter } from "@/lib/security/leadRateLimit";
import { isRequestOriginAllowed } from "@/lib/security/origin";
import { getRequestIp } from "@/lib/security/requestIp";
import {
  TurnstileUnavailableError,
  verifyTurnstileToken,
} from "@/lib/security/turnstile";

const ContactSchema = z.strictObject({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().pipe(z.email()),
  message: z.string().trim().min(5).max(2000),
  captchaToken: z.string().min(1).max(2048),
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

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const ipAddress = getRequestIp(request.headers);
  if (!ipAddress) {
    return NextResponse.json(
      { error: "Client IP unavailable" },
      { status: 400 },
    );
  }

  try {
    const verified = await verifyTurnstileToken(
      parsed.data.captchaToken,
      ipAddress,
    );
    if (!verified) {
      return NextResponse.json(
        { error: "Human verification failed" },
        { status: 400 },
      );
    }

    const retryAfterSeconds = await getSubmissionRetryAfter(ipAddress);
    if (retryAfterSeconds > 0) {
      return NextResponse.json(
        { error: "Rate limited", retryAfterSeconds },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSeconds) },
        },
      );
    }

    const webhook = process.env.CONTACT_WEBHOOK_URL;
    if (!webhook) {
      console.error("CONTACT_WEBHOOK_URL is not configured.");
      return NextResponse.json(
        { error: "Contact service unavailable" },
        { status: 503 },
      );
    }

    const { captchaToken: _captchaToken, ...contact } = parsed.data;
    const serializedPayload = JSON.stringify({
      ...contact,
      receivedAt: new Date().toISOString(),
    });
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const webhookSecret = process.env.CONTACT_WEBHOOK_SECRET;
    if (webhookSecret) {
      headers["x-vector-signature"] = createHmac("sha256", webhookSecret)
        .update(serializedPayload)
        .digest("hex");
    }

    const webhookResponse = await fetch(webhook, {
      method: "POST",
      headers,
      body: serializedPayload,
      signal: AbortSignal.timeout(8_000),
      cache: "no-store",
    });
    if (!webhookResponse.ok) {
      console.error("Contact webhook responded with a non-success status.");
      return NextResponse.json(
        { error: "Contact service unavailable" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof TurnstileUnavailableError) {
      console.error("Turnstile contact verification unavailable:", error);
      return NextResponse.json(
        { error: "Human verification unavailable" },
        { status: 503 },
      );
    }

    console.error("Contact submission failed:", error);
    return NextResponse.json(
      { error: "Contact service unavailable" },
      { status: 502 },
    );
  }
}
