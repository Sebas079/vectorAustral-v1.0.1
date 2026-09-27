import { LeadContactConflictError, saveLead } from "@/lib/firebase/leadService";
import { getSubmissionRetryAfter } from "@/lib/security/leadRateLimit";
import { getRequestIp } from "@/lib/security/requestIp";
import {
  TurnstileUnavailableError,
  verifyTurnstileToken,
} from "@/lib/security/turnstile";
import { leadSubmissionSchema } from "@/lib/validators/leadSchema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  const parsed = leadSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  if (parsed.data.honeypot) {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  const ipAddress = getRequestIp(request.headers);
  if (!ipAddress) {
    return Response.json({ error: "client_ip_unavailable" }, { status: 400 });
  }

  try {
    const verified = await verifyTurnstileToken(
      parsed.data.captchaToken,
      ipAddress,
    );
    if (!verified) {
      return Response.json({ error: "verification_failed" }, { status: 400 });
    }

    const retryAfterSeconds = await getSubmissionRetryAfter(ipAddress);
    if (retryAfterSeconds > 0) {
      return Response.json(
        { error: "rate_limited", retryAfterSeconds },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSeconds) },
        },
      );
    }

    const lead = await saveLead({
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      reason: parsed.data.reason,
    });

    return Response.json({ id: lead.id });
  } catch (error) {
    if (error instanceof LeadContactConflictError) {
      return Response.json({ error: "contact_conflict" }, { status: 409 });
    }

    if (error instanceof TurnstileUnavailableError) {
      console.error("Turnstile submission verification unavailable:", error);
      return Response.json(
        { error: "verification_unavailable" },
        { status: 503 },
      );
    }

    console.error("Lead submission failed:", error);
    return Response.json({ error: "submission_failed" }, { status: 500 });
  }
}
