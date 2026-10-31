import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  findLeadMock,
  saveLeadMock,
  rateLimitMock,
  verifyTokenMock,
  conflictError,
} = vi.hoisted(() => ({
  findLeadMock: vi.fn(),
  saveLeadMock: vi.fn(),
  rateLimitMock: vi.fn(),
  verifyTokenMock: vi.fn(),
  conflictError: class LeadContactConflictError extends Error {},
}));

vi.mock("../lib/firebase/leadService", () => ({
  LeadContactConflictError: conflictError,
  findLeadByContact: findLeadMock,
  saveLead: saveLeadMock,
}));
vi.mock("../lib/security/leadRateLimit", () => ({
  getSubmissionRetryAfter: rateLimitMock,
}));
vi.mock("../lib/security/turnstile", () => ({
  verifyTurnstileToken: verifyTokenMock,
  TurnstileUnavailableError: class TurnstileUnavailableError extends Error {},
}));

import { POST as lookupLead } from "../app/api/leads/lookup/route";
import { POST as submitLead } from "../app/api/leads/route";

const headers = {
  "content-type": "application/json",
  "x-real-ip": "192.0.2.25",
};

const lookupBody = {
  email: "ana@example.com",
  phone: "+54 9 11 5555-1234",
  captchaToken: "turnstile-token",
};

const submissionBody = {
  fullName: "Ana Gómez",
  email: lookupBody.email,
  phone: lookupBody.phone,
  reason: "Automatizar consultas.",
  captchaToken: lookupBody.captchaToken,
  honeypot: "",
};

describe("lead API routes", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    verifyTokenMock.mockResolvedValue(true);
    rateLimitMock.mockResolvedValue(0);
    findLeadMock.mockResolvedValue({
      id: "lead-1",
      fullName: "Ana Gómez",
      email: lookupBody.email,
      phone: lookupBody.phone,
    });
    saveLeadMock.mockResolvedValue({ id: "lead-1" });
  });

  it("does not look up a lead when Turnstile rejects the token", async () => {
    verifyTokenMock.mockResolvedValueOnce(false);
    const response = await lookupLead(
      new Request("http://localhost/api/leads/lookup", {
        method: "POST",
        headers,
        body: JSON.stringify(lookupBody),
      }),
    );

    expect(response.status).toBe(400);
    expect(findLeadMock).not.toHaveBeenCalled();
  });

  it("returns only the name after verified matching contact lookup", async () => {
    const response = await lookupLead(
      new Request("http://localhost/api/leads/lookup", {
        method: "POST",
        headers,
        body: JSON.stringify(lookupBody),
      }),
    );

    expect(await response.json()).toEqual({
      match: true,
      fullName: "Ana Gómez",
    });
    expect(verifyTokenMock).toHaveBeenCalledWith(
      lookupBody.captchaToken,
      "192.0.2.25",
    );
    expect(findLeadMock).toHaveBeenCalledWith(
      lookupBody.email,
      lookupBody.phone,
    );
  });

  it("verifies Turnstile and rate limits before saving", async () => {
    rateLimitMock.mockResolvedValueOnce(7);
    const response = await submitLead(
      new Request("http://localhost/api/leads", {
        method: "POST",
        headers,
        body: JSON.stringify(submissionBody),
      }),
    );

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("7");
    expect(saveLeadMock).not.toHaveBeenCalled();
  });

  it("saves only a verified submission", async () => {
    const response = await submitLead(
      new Request("http://localhost/api/leads", {
        method: "POST",
        headers,
        body: JSON.stringify(submissionBody),
      }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ id: "lead-1" });
    expect(saveLeadMock).toHaveBeenCalledWith({
      fullName: submissionBody.fullName,
      email: submissionBody.email,
      phone: submissionBody.phone,
      reason: submissionBody.reason,
    });
  });

  it("rejects conflicting contact records without exposing either lead", async () => {
    saveLeadMock.mockRejectedValueOnce(new conflictError());
    const response = await submitLead(
      new Request("http://localhost/api/leads", {
        method: "POST",
        headers,
        body: JSON.stringify(submissionBody),
      }),
    );

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ error: "contact_conflict" });
  });
});
