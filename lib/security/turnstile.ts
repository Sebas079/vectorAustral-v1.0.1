import "server-only";

import { z } from "zod";

const siteVerifyResponseSchema = z.object({
  success: z.boolean(),
  hostname: z.string().optional(),
  "error-codes": z.array(z.string()).optional(),
});

export class TurnstileUnavailableError extends Error {
  constructor(options?: ErrorOptions) {
    super("No se pudo validar la verificación humana.", options);
    this.name = "TurnstileUnavailableError";
  }
}

export async function verifyTurnstileToken(
  token: string,
  remoteIp: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    throw new Error("Falta TURNSTILE_SECRET_KEY.");
  }
  const expectedHostname = process.env.TURNSTILE_HOSTNAME;
  if (!expectedHostname) {
    throw new Error("Falta TURNSTILE_HOSTNAME.");
  }

  let response: Response;
  try {
    response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret,
          response: token,
          remoteip: remoteIp,
        }),
        signal: AbortSignal.timeout(5_000),
        cache: "no-store",
      },
    );
  } catch (error) {
    throw new TurnstileUnavailableError({ cause: error });
  }

  if (!response.ok) {
    throw new TurnstileUnavailableError();
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch (error) {
    throw new TurnstileUnavailableError({ cause: error });
  }

  const parsedResponse = siteVerifyResponseSchema.safeParse(payload);
  if (!parsedResponse.success) {
    throw new TurnstileUnavailableError({ cause: parsedResponse.error });
  }

  return (
    parsedResponse.data.success &&
    parsedResponse.data.hostname?.toLowerCase() ===
      expectedHostname.toLowerCase()
  );
}
