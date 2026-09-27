import "server-only";

import { isIP } from "node:net";

export function getRequestIp(headers: Headers): string | null {
  const forwardedIp =
    headers.get("x-real-ip")?.trim() ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  if (forwardedIp && isIP(forwardedIp)) {
    return forwardedIp;
  }

  return process.env.NODE_ENV === "development" ? "127.0.0.1" : null;
}
