"use client";

import { useState } from "react";
import { z } from "zod";

const navItems = [
  { href: "#nosotros", label: "Nosotros" },
  { href: "#servicios", label: "Servicios" },
  { href: "#clientes", label: "Clientes" },
  { href: "#contacto", label: "Contacto" },
];

const highlights = [
  "Páginas y tiendas web",
  "Apps internas y productos digitales",
  "Automatizaciones con n8n",
];

const services = [
  {
    title: "Webs de alto impacto",
    description:
      "Landing pages, sitios corporativos y tiendas online diseñadas para vender, captar leads y convertir.",
    bullets: ["Diseño premium", "SEO técnico", "Optimización de conversión"],
  },
  {
    title: "Aplicaciones web",
    description:
      "Herramientas digitales para operar mejor: dashboards, portales, paneles y apps internas.",
    bullets: ["Flujos claros", "Escalables", "Experiencia intuitiva"],
  },
  {
    title: "Automatizaciones",
    description:
      "Conectamos sistemas, procesos y equipos para reducir tareas repetitivas y ahorrar tiempo real.",
    bullets: ["n8n", "Integraciones", "Procesos sin fricción"],
  },
];

const workflow = [
  {
    step: "01",
    title: "Diagnóstico",
    description:
      "Analizamos el negocio, los objetivos y las fricciones para definir la solución correcta.",
  },
  {
    step: "02",
    title: "Diseño y desarrollo",
    description:
      "Construimos desde la arquitectura hasta la interfaz con foco en rendimiento, claridad y crecimiento.",
  },
  {
    step: "03",
    title: "Implementación y escalado",
    description:
      "Entregamos, optimizamos y conectamos cada parte para que la solución siga funcionando mejor.",
  },
];

const metrics = [
  { value: "+30%", label: "reducción de tareas manuales" },
  { value: "2x", label: "mejor velocidad de operación" },
  { value: "24/7", label: "automatización continua" },
];

const clients = [
  {
    name: "Operación",
    text: "Automatizamos reportes y seguimiento para equipos comerciales.",
  },
  {
    name: "E-commerce",
    text: "Aumentamos la velocidad de carga y simplificamos la experiencia de compra.",
  },
  {
    name: "B2B",
    text: "Conectamos procesos internos para reducir errores y ahorrar tiempo.",
  },
];

function VectorAustralLogo() {
  return (
    <div className="rounded-2xl border border-cyan-400/20 bg-slate-950/70 p-3 shadow-[0_0_60px_rgba(6,182,212,0.12)] backdrop-blur sm:p-4">
      <img
        src="/sources/logo.svg"
        alt="Vector Austral"
        className="h-10 w-auto sm:h-12 lg:h-14"
      />
    </div>
  );
}

const ContactSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "Nombre muy largo"),
  email: z.string().email("Email inválido"),
  message: z
    .string()
    .min(5, "Mensaje muy corto")
    .max(2000, "Mensaje muy largo"),
});

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | "success" | "error">(null);
  const [errors, setErrors] = useState<string[] | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setErrors(null);
    // client-side validation using Zod
    const input = {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    };
    const parsed = ContactSchema.safeParse(input);
    if (!parsed.success) {
      const errMsgs = Object.values(parsed.error.flatten().fieldErrors)
        .flat()
        .filter(Boolean) as string[];
      setErrors(errMsgs);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error("Network error");
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre"
          className="rounded-md border border-gray-800 bg-gray-900/80 px-3 py-2 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="rounded-md border border-gray-800 bg-gray-900/80 px-3 py-2 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
      </div>

      <textarea
        required
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Contanos brevemente tu proyecto"
        rows={4}
        className="w-full rounded-md border border-gray-800 bg-gray-900/80 px-3 py-2 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
      />

      {errors && (
        <div className="space-y-1">
          {errors.map((err) => (
            <p key={err} className="text-sm text-rose-400">
              {err}
            </p>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow transition-colors duration-150 disabled:opacity-60"
        >
          {loading ? "Enviando..." : "Enviar mensaje"}
        </button>
        {status === "success" && (
          <span className="text-sm text-emerald-400">
            Enviado. Te contactamos pronto.
          </span>
        )}
        {status === "error" && (
          <span className="text-sm text-rose-400">
            Error al enviar. Intentá nuevamente.
          </span>
        )}
      </div>
    </form>
  );
}

export function HeroSection() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);

  return (
    <section className="relative overflow-hidden px-4 py-6 sm:px-8 lg:px-12 lg:py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:gap-16">
        <header className="sticky top-4 z-40 rounded-full border border-gray-800/80 bg-slate-950/80 px-4 py-3 shadow-lg shadow-blue-950/20 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <a href="#top" className="flex items-center gap-3">
              <VectorAustralLogo />
            </a>

            <nav className="hidden">
              {/* Menu intentionally hidden; open with toggle */}
            </nav>

            <button
              type="button"
              className="rounded-full border border-gray-700 px-3 py-2 text-sm font-semibold text-gray-200"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-expanded={menuOpen}
              aria-label="Abrir menú"
            >
              {menuOpen ? "Cerrar" : "Menú"}
            </button>
          </div>

          {menuOpen ? (
            <div className="mt-3 absolute left-4 right-4 top-full z-50 rounded-2xl border border-gray-800 bg-slate-950/95 p-4 shadow-2xl">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="rounded-2xl px-3 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-900 hover:text-white"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </header>

        <div
          id="top"
          className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center"
        >
          <div className="max-w-2xl">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-400" />
                Soluciones web, apps y automatizaciones
              </div>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-7xl">
              Creamos productos digitales que convierten, automatizan y hacen
              crecer tu negocio.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-400 sm:text-xl">
              En Vector Austral diseñamos páginas, aplicaciones y flujos
              automatizados que ayudan a empresas a vender mejor, operar más
              rápido y escalar con claridad.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#contacto"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:bg-blue-700"
              >
                Reservar diagnóstico inicial
              </a>
              <a
                href="#servicios"
                className="inline-flex items-center justify-center rounded-full border border-gray-700 px-6 py-3 text-sm font-semibold text-gray-200 transition-all duration-200 hover:border-blue-500/40 hover:text-white"
              >
                Ver servicios
              </a>
            </div>

            <ul className="mt-8 flex flex-wrap justify-start gap-3">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-center justify-center min-w-[12rem] text-center rounded-full border border-gray-800 bg-gray-900/70 px-4 py-2 text-sm text-gray-300 transition-all duration-200 hover:shadow-[0_8px_30px_rgba(6,182,212,0.12)] hover:-translate-y-0.5"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-900/70 p-6 shadow-2xl shadow-blue-950/30 backdrop-blur">
            <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-blue-500/10 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
                Qué construimos
              </p>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-gray-800 bg-slate-950/80 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                    Experiencia digital
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    Interfaces claras, rápidas y pensadas para conversiones.
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-800 bg-slate-950/80 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                    Automatización
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    Flujos que eliminan trabajo repetitivo y ahorran tiempo.
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-800 bg-slate-950/80 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                    Escalabilidad
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    Sistemas listos para crecer con tu empresa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section
          id="nosotros"
          className="grid gap-6 rounded-3xl border border-gray-800 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/40 p-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:p-10"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
              Nosotros
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Un equipo técnico que combina estrategia, diseño y automatización.
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-400">
              Diseñamos soluciones digitales con foco en eficiencia operativa,
              claridad de negocio y resultados medibles.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-slate-950/70 p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { value: "B2B", label: "enfoque" },
                { value: "n8n", label: "integraciones" },
                { value: "ROI", label: "orientado" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-gray-800 bg-gray-900/70 p-4 text-center"
                >
                  <p className="text-2xl font-semibold text-white">
                    {item.value}
                  </p>
                  <p className="mt-1 text-sm text-gray-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="servicios" className="grid gap-6 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.title}
              className="flex min-h-[16rem] flex-col justify-between rounded-3xl border border-gray-800 bg-gray-900/70 p-6 shadow-lg shadow-blue-950/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_60px_rgba(6,182,212,0.10)] hover:border-blue-500/30"
            >
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {service.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-gray-400">
                  {service.description}
                </p>
              </div>

              <ul className="mt-5 space-y-2">
                {service.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-center gap-2 text-sm text-gray-300"
                  >
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section
          id="clientes"
          className="rounded-3xl border border-gray-800 bg-gray-900/70 p-8 lg:p-10"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
                Clientes
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                Resultados claros para operaciones que necesitan acelerar.
              </h2>
            </div>
            <p className="max-w-xl text-lg leading-8 text-gray-400">
              Trabajamos con negocios que necesitan conectar tecnología,
              procesos y crecimiento sin perder tiempo.
            </p>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {clients.map((client) => (
              <div
                key={client.name}
                className="rounded-2xl border border-gray-800 bg-slate-950/70 p-5"
              >
                <p className="text-lg font-semibold text-white">
                  {client.name}
                </p>
                <p className="mt-2 text-sm leading-7 text-gray-400">
                  {client.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="proceso"
          className="rounded-3xl border border-gray-800 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/50 p-8 lg:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
                Cómo trabajamos
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                Un proceso simple, claro y orientado a resultados.
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-8 text-gray-400">
                Nos enfocamos en entender el problema real y entregar una
                solución útil, rápida y escalable.
              </p>
            </div>

            <div className="space-y-4">
              {workflow.map((item) => (
                <div
                  key={item.step}
                  className="rounded-2xl border border-gray-800 bg-slate-950/70 p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
                      {item.step}
                    </span>
                    <h3 className="text-lg font-semibold text-white">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-gray-400">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="contacto"
          className="grid gap-6 rounded-3xl border border-gray-800 bg-gray-900/70 p-8 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:p-10"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
              Tu próximo paso
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Listo para llevar tu negocio al siguiente nivel digital.
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-400">
              Hablemos sobre tu idea, tu operación y cómo podemos construir algo
              que realmente te ayude a crecer.
            </p>
          </div>

          <div className="space-y-6 rounded-2xl border border-gray-800 bg-slate-950/70 p-6">
            <div className="grid gap-4">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="flex items-center justify-between border-b border-gray-800 pb-3 last:border-b-0 last:pb-0"
                >
                  <span className="text-sm text-gray-400">{metric.label}</span>
                  <span className="text-lg font-semibold text-white">
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>

            <ContactForm />
          </div>
        </section>
      </div>

      <button
        type="button"
        onClick={() => setAssistantOpen((prev) => !prev)}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-full border border-cyan-400/30 bg-slate-950/90 px-4 py-3 text-sm font-semibold text-white shadow-[0_0_40px_rgba(6,182,212,0.22)] backdrop-blur transition-all duration-200 hover:border-cyan-400/60"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20 text-lg">
          🤖
        </span>
        <span className="hidden sm:block">VectorUno</span>
      </button>

      {assistantOpen ? (
        <div className="fixed bottom-24 right-4 z-50 w-[min(92vw,22rem)] rounded-3xl border border-cyan-400/20 bg-slate-950/95 p-4 shadow-2xl shadow-cyan-950/30 backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-cyan-300">VectorUno</p>
              <p className="mt-1 text-sm text-gray-400">
                Tu asistente virtual impulsado por IA.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAssistantOpen(false)}
              className="rounded-full border border-gray-700 px-2 py-1 text-xs text-gray-300"
            >
              Cerrar
            </button>
          </div>

          <div className="mt-4 rounded-2xl border border-gray-800 bg-gray-900/70 p-4">
            <p className="text-sm leading-7 text-gray-300">
              Hola, soy VectorUno. Puedo ayudarte a descubrir nuestros
              servicios, responder preguntas rápidas o guiarte hacia el
              diagnóstico inicial.
            </p>
          </div>

          <div className="mt-4 grid gap-2">
            {[
              { label: "Ver servicios", href: "#servicios" },
              { label: "Hablar con el equipo", href: "#contacto" },
              { label: "Solicitar diagnóstico", href: "#contacto" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setAssistantOpen(false)}
                className="rounded-2xl border border-gray-800 bg-slate-900/80 px-3 py-2 text-sm text-gray-200 transition hover:border-cyan-400/40 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
