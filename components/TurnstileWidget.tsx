"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

interface TurnstileOptions {
  sitekey: string;
  theme: "dark";
  callback: (token: string) => void;
  "expired-callback": () => void;
  "error-callback": () => void;
}

interface TurnstileApi {
  render(container: HTMLElement, options: TurnstileOptions): string;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

interface TurnstileWidgetProps {
  resetKey: number;
  retryKey: number;
  onToken: (token: string) => void;
  onError: () => void;
}

export default function TurnstileWidget({
  resetKey,
  retryKey,
  onToken,
  onError,
}: TurnstileWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  const onErrorRef = useRef(onError);
  const errorReportedRef = useRef(false);
  const [isWidgetMounted, setIsWidgetMounted] = useState(false);
  const [hasLoadError, setHasLoadError] = useState(false);

  useEffect(() => {
    onTokenRef.current = onToken;
    onErrorRef.current = onError;
  }, [onError, onToken]);

  const reportError = useCallback(() => {
    if (errorReportedRef.current) {
      return;
    }
    errorReportedRef.current = true;
    setHasLoadError(true);
    onErrorRef.current();
  }, []);

  const mountWidget = useCallback(() => {
    if (
      !siteKey ||
      errorReportedRef.current ||
      !window.turnstile ||
      !containerRef.current
    ) {
      return;
    }

    try {
      widgetIdRef.current ??= window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: "dark",
        callback: (token) => {
          setIsWidgetMounted(true);
          onTokenRef.current(token);
        },
        "expired-callback": () => {
          onTokenRef.current("");
          onErrorRef.current();
        },
        "error-callback": () => {
          onTokenRef.current("");
          onErrorRef.current();
        },
      });
      setIsWidgetMounted(true);
    } catch {
      reportError();
    }
  }, [reportError, siteKey]);

  useEffect(() => {
    errorReportedRef.current = false;
    if (!siteKey) {
      const timeoutId = window.setTimeout(reportError, 0);
      return () => window.clearTimeout(timeoutId);
    }

    const resetTimeoutId = window.setTimeout(() => {
      setHasLoadError(false);
      setIsWidgetMounted(Boolean(widgetIdRef.current));
    }, 0);

    const deadline = Date.now() + 10_000;
    let timeoutId: number;
    const waitForWidget = () => {
      if (widgetIdRef.current || errorReportedRef.current) {
        return;
      }
      if (window.turnstile) {
        mountWidget();
        if (widgetIdRef.current || errorReportedRef.current) {
          return;
        }
      }
      if (Date.now() >= deadline) {
        reportError();
        return;
      }
      timeoutId = window.setTimeout(waitForWidget, 250);
    };

    timeoutId = window.setTimeout(waitForWidget, 250);
    return () => {
      window.clearTimeout(resetTimeoutId);
      window.clearTimeout(timeoutId);
    };
  }, [mountWidget, reportError, retryKey, siteKey]);

  useEffect(() => {
    if (resetKey === 0) {
      return;
    }
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, [mountWidget, resetKey]);

  useEffect(
    () => () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    },
    [],
  );

  return (
    <div className="space-y-2">
      {!isWidgetMounted && !hasLoadError ? (
        <p role="status" className="text-sm text-slate-300">
          Cargando la verificación humana…
        </p>
      ) : null}
      {siteKey ? (
        <Script
          key={retryKey}
          id={`turnstile-api-${retryKey}`}
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={mountWidget}
          onError={reportError}
        />
      ) : null}
      <div ref={containerRef} />
    </div>
  );
}
