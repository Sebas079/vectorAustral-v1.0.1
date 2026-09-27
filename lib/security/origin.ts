import "server-only";

export function isRequestOriginAllowed(headers: Headers): boolean {
  const allowedOrigins =
    process.env.ALLOWED_ORIGINS?.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean) ?? [];

  if (allowedOrigins.length === 0) {
    return true;
  }

  const originHeader = headers.get("origin") || headers.get("referer") || "";
  if (!originHeader) {
    return true;
  }

  let requestOrigin: string;
  try {
    requestOrigin = new URL(originHeader).origin;
  } catch {
    return false;
  }

  return allowedOrigins.includes(requestOrigin);
}
