"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef } from "react";

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

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function TurnstileWidget({
  resetKey,
  retryKey,
  onToken,
  onError,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onTokenRef.current = onToken;
    onErrorRef.current = onError;
  }, [onError, onToken]);

  const mountWidget = useCallback(() => {
    if (!siteKey || !window.turnstile || !containerRef.current) {
      return;
    }

    widgetIdRef.current ??= window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: "dark",
      callback: (token) => onTokenRef.current(token),
      "expired-callback": () => {
        onTokenRef.current("");
        onErrorRef.current();
      },
      "error-callback": () => {
        onTokenRef.current("");
        onErrorRef.current();
      },
    });
  }, []);

  useEffect(() => {
    mountWidget();
  }, [mountWidget]);

  useEffect(() => {
    if (!siteKey) {
      onErrorRef.current();
    }
  }, []);

  useEffect(() => {
    if (resetKey === 0) {
      return;
    }
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    } else {
      mountWidget();
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
    <div>
      {siteKey ? (
        <Script
          key={retryKey}
          id={`turnstile-api-${retryKey}`}
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={mountWidget}
          onError={() => onErrorRef.current()}
        />
      ) : null}
      <div ref={containerRef} />
    </div>
  );
}
