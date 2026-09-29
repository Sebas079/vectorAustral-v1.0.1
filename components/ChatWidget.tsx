"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";

import { answerBot } from "@/lib/bot/botEngine";

interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const initialMessage: ChatMessage = {
  id: 1,
  role: "assistant",
  content:
    "Soy Vector Uno. Puedo contarte sobre desarrollo web, automatizaciones con n8n y el Diagnóstico Inicial.",
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const question = input.trim();

    if (!question) {
      return;
    }

    // El motor conserva respuestas deterministas y evita presupuestos automáticos.
    const response = answerBot(question);
    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: question,
    };
    const assistantMessage: ChatMessage = {
      id: Date.now() + 1,
      role: "assistant",
      content: response.message,
    };

    setMessages((current) => [...current, userMessage, assistantMessage]);
    setInput("");
  };

  return (
    <aside className="fixed right-5 bottom-5 z-20 flex flex-col items-end gap-3">
      {isOpen ? (
        <section
          id="vector-uno-chat"
          aria-label="Chat de Vector Uno"
          className="w-[min(24rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-white/15 bg-abyss text-slate-100 shadow-2xl shadow-black/40"
        >
          <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <p className="font-semibold text-white">Vector Uno</p>
              <p className="text-xs text-slate-400">
                Asistente de Vector Austral
              </p>
            </div>
            <button
              type="button"
              aria-label="Cerrar chat"
              onClick={() => setIsOpen(false)}
              className="rounded-lg px-2 py-1 text-slate-300 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-volt"
            >
              ×
            </button>
          </header>

          <div
            aria-live="polite"
            className="flex max-h-80 flex-col gap-3 overflow-y-auto px-5 py-4"
          >
            {messages.map((message) => (
              <p
                key={message.id}
                className={`max-w-[90%] rounded-xl px-3 py-2 text-sm leading-6 ${
                  message.role === "user"
                    ? "self-end bg-volt text-navy"
                    : "self-start bg-graphite text-slate-200"
                }`}
              >
                {message.content}
              </p>
            ))}
          </div>

          <a
            href="#contacto"
            onClick={() => setIsOpen(false)}
            className="mx-5 mb-4 block rounded-lg border border-volt/50 px-3 py-2 text-center text-sm font-medium text-volt hover:bg-volt/10 focus:outline-none focus:ring-2 focus:ring-volt"
          >
            Hablar con un especialista
          </a>

          <form
            onSubmit={handleSubmit}
            className="flex gap-2 border-t border-white/10 p-4"
          >
            <label htmlFor="chat-input" className="sr-only">
              Escribí tu consulta
            </label>
            <input
              id="chat-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Escribí tu consulta"
              className="min-w-0 flex-1 rounded-lg border border-white/15 bg-navy px-3 py-2 text-sm text-white outline-none focus:border-volt focus:ring-2 focus:ring-volt/30"
            />
            <button
              type="submit"
              className="rounded-lg bg-volt px-3 py-2 text-sm font-semibold text-navy hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-volt"
            >
              Enviar
            </button>
          </form>
        </section>
      ) : null}

      <div className="flex items-center gap-3">
        {!isOpen ? (
          <span className="hidden rounded-full border border-volt/20 bg-navy/95 px-3 py-2 text-xs text-slate-300 shadow-lg shadow-cyan-950/20 sm:block">
            ¿Necesitás orientación?
          </span>
        ) : null}
        <button
          type="button"
          aria-label={isOpen ? "Cerrar Vector Uno" : "Hablar con Vector Uno"}
          aria-expanded={isOpen}
          aria-controls="vector-uno-chat"
          onClick={() => setIsOpen((current) => !current)}
          className={`group relative flex size-16 items-center justify-center rounded-full border border-volt/50 bg-navy shadow-lg shadow-cyan-500/25 transition hover:border-volt hover:bg-graphite focus:outline-none focus:ring-2 focus:ring-volt focus:ring-offset-2 focus:ring-offset-abyss ${
            isOpen ? "" : "motion-chat-pulse"
          }`}
        >
          <span className="absolute inset-1 rounded-full border border-volt/20" />
          <Image
            src="/assets/brand/vector-austral-logo.svg"
            alt=""
            width="220"
            height="53"
            className="relative h-auto w-11 object-contain"
          />
          <span className="sr-only">
            {isOpen ? "Cerrar Vector Uno" : "Hablar con Vector Uno"}
          </span>
        </button>
      </div>
    </aside>
  );
}
