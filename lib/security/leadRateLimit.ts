import "server-only";

import { createHmac } from "node:crypto";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

import { getAdminFirestore } from "@/lib/firebase/admin";

const SUBMISSION_INTERVAL_MS = 10_000;

export function getRetryAfterSeconds(
  previousAttemptMs: number,
  now: number,
): number {
  return Math.max(
    0,
    Math.ceil((SUBMISSION_INTERVAL_MS - (now - previousAttemptMs)) / 1000),
  );
}

export async function getSubmissionRetryAfter(
  ipAddress: string,
  now = Date.now(),
): Promise<number> {
  const hmacSecret = process.env.LEAD_RATE_LIMIT_HMAC_KEY;
  if (!hmacSecret || hmacSecret.length < 32) {
    throw new Error(
      "LEAD_RATE_LIMIT_HMAC_KEY debe contener al menos 32 caracteres.",
    );
  }

  const ipHash = createHmac("sha256", hmacSecret)
    .update("lead-rate-limit:")
    .update(ipAddress)
    .digest("hex");
  const db = getAdminFirestore();
  const rateLimitRef = db.collection("leadSubmissionRateLimits").doc(ipHash);

  return db.runTransaction(async (transaction) => {
    const rateLimit = await transaction.get(rateLimitRef);
    const lastAttemptAt: unknown = rateLimit.get("lastAttemptAt");
    const previousAttempt =
      lastAttemptAt instanceof Timestamp ? lastAttemptAt.toMillis() : undefined;

    if (previousAttempt !== undefined) {
      const retryAfterSeconds = getRetryAfterSeconds(previousAttempt, now);
      if (retryAfterSeconds > 0) {
        return retryAfterSeconds;
      }
    }

    transaction.set(rateLimitRef, {
      lastAttemptAt: new Date(now),
      expiresAt: new Date(now + SUBMISSION_INTERVAL_MS * 2),
      touchedAt: FieldValue.serverTimestamp(),
    });
    return 0;
  });
}
