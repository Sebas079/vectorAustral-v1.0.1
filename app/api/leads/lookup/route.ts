import { findLeadByContact } from "@/lib/firebase/leadService";
import { getRequestIp } from "@/lib/security/requestIp";
import {
  TurnstileUnavailableError,
  verifyTurnstileToken,
} from "@/lib/security/turnstile";
import { leadLookupSchema } from "@/lib/validators/leadSchema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  const parsed = leadLookupSchema.safeParse(body);
  if (!parsed.success) {
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

    const lead = await findLeadByContact(parsed.data.email, parsed.data.phone);
    return Response.json(
      lead ? { match: true, fullName: lead.fullName } : { match: false },
    );
  } catch (error) {
    if (error instanceof TurnstileUnavailableError) {
      console.error("Turnstile lookup verification unavailable:", error);
      return Response.json(
        { error: "verification_unavailable" },
        { status: 503 },
      );
    }

    console.error("Lead lookup failed:", error);
    return Response.json({ error: "lookup_failed" }, { status: 500 });
  }
}
