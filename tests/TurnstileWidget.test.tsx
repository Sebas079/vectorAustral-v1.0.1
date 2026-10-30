import { act, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/script", async () => {
  const { useEffect } = await import("react");

  function MockScript({ onReady }: { onReady?: () => void }) {
    useEffect(() => {
      onReady?.();
    }, [onReady]);
    return null;
  }

  return {
    default: MockScript,
  };
});

import TurnstileWidget from "../components/TurnstileWidget";

describe("TurnstileWidget", () => {
  const onToken = vi.fn();
  const onError = vi.fn();

  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "public-test-site-key");
    onToken.mockReset();
    onError.mockReset();
    window.turnstile = {
      render: vi.fn(() => "widget-id"),
      reset: vi.fn(),
      remove: vi.fn(),
    };
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    delete window.turnstile;
    vi.useRealTimers();
  });

  it("mounts Turnstile and stops showing the loading status", async () => {
    render(
      <TurnstileWidget
        resetKey={0}
        retryKey={0}
        onToken={onToken}
        onError={onError}
      />,
    );

    await waitFor(() =>
      expect(window.turnstile?.render).toHaveBeenCalledOnce(),
    );
    expect(
      screen.queryByText("Cargando la verificación humana…"),
    ).not.toBeInTheDocument();
    expect(onError).not.toHaveBeenCalled();
  });

  it("reports unavailable when the widget does not initialize within ten seconds", async () => {
    vi.useFakeTimers();
    delete window.turnstile;

    render(
      <TurnstileWidget
        resetKey={0}
        retryKey={0}
        onToken={onToken}
        onError={onError}
      />,
    );

    expect(
      screen.getByText("Cargando la verificación humana…"),
    ).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10_250);
    });

    expect(onError).toHaveBeenCalledOnce();
    expect(
      screen.queryByText("Cargando la verificación humana…"),
    ).not.toBeInTheDocument();
  });

  it("reports unavailable immediately when no public site key is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");

    render(
      <TurnstileWidget
        resetKey={0}
        retryKey={0}
        onToken={onToken}
        onError={onError}
      />,
    );

    await waitFor(() => expect(onError).toHaveBeenCalledOnce());
    expect(
      screen.queryByText("Cargando la verificación humana…"),
    ).not.toBeInTheDocument();
  });
});
