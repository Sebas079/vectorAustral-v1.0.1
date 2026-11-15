import { landingContent } from "@/sources/content/landing";
import { getWhatsAppHref } from "@/lib/contact";

export default function Hero() {
  const { hero } = landingContent;
  const whatsappHref = getWhatsAppHref();
  const contactEmail =
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contacto@vectoraustral.com";

  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-16 text-slate-100 sm:pb-24 sm:pt-24">
      <div className="pointer-events-none absolute -right-32 top-8 size-96 rounded-full bg-volt/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="motion-rise">
          <p className="mb-6 inline-flex rounded-full border border-volt/30 bg-volt/10 px-4 py-2 text-sm font-medium text-volt">
            {hero.eyebrow}
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
            {hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400 sm:text-xl">
            {hero.description}
          </p>
          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <a
              href={whatsappHref ?? `mailto:${contactEmail}`}
              target={whatsappHref ? "_blank" : undefined}
              rel={whatsappHref ? "noreferrer" : undefined}
              className="rounded-full bg-volt px-6 py-3.5 font-semibold text-navy shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-volt focus:ring-offset-2 focus:ring-offset-abyss"
            >
              {whatsappHref ? hero.cta : "Escribir por email"}
            </a>
            <a
              href="#servicios"
              className="rounded-full border border-white/15 px-6 py-3.5 font-semibold text-slate-200 transition hover:border-volt/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-volt"
            >
              {hero.secondaryCta}
            </a>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-6 text-slate-500">
            {hero.support}
          </p>
        </div>

        <div className="motion-rise motion-rise-delay relative rounded-3xl border border-volt/20 bg-navy/75 p-6 shadow-2xl shadow-blue-950/30 sm:p-8">
          <div className="absolute -left-px top-8 h-20 w-px bg-volt" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-volt">
                Un ejemplo de automatización
              </p>
              <h2 className="mt-2 max-w-sm text-2xl font-semibold leading-tight text-white">
                La consulta llega. Los datos se registran solos.
              </h2>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
              n8n
            </span>
          </div>
          <div className="mt-8 space-y-3">
            {[
              { title: "WhatsApp", description: "Entra una consulta" },
              { title: "Google Sheets", description: "Queda registrada" },
              { title: "CRM", description: "El equipo puede seguirla" },
            ].map((step, index) => (
              <div key={step.title} className="relative pl-7">
                {index < 2 ? (
                  <span
                    aria-hidden="true"
                    className="absolute left-[0.45rem] top-5 h-10 w-px bg-volt/40"
                  />
                ) : null}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-3 size-4 rounded-full border-2 border-volt bg-navy"
                />
                <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-abyss/70 px-4 py-3">
                  <p className="font-semibold text-white">{step.title}</p>
                  <p className="text-right text-sm text-slate-400">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm leading-6 text-slate-400">
            Menos copiar y pegar. Más tiempo para atender a tus clientes.
          </p>
        </div>
      </div>
    </section>
  );
}
