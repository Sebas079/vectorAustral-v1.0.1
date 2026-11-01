import { servicesContent } from "@/sources/content/services";

export default function ServicesShowroom() {
  return (
    <section id="servicios" className="px-6 py-12 text-slate-100 sm:py-16">
      <div className="motion-rise mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold text-volt">
            Ejemplos concretos
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Así se ve una solución en el trabajo diario.
          </h2>
          <p className="mt-5 max-w-2xl leading-7 text-slate-300">
            No hace falta empezar por una plataforma enorme. Primero vemos dónde
            se pierde tiempo o se escapan consultas.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {servicesContent.map((service, index) => (
            <article
              key={service.id}
              className={`flex flex-col justify-between border p-6 sm:p-8 ${
                index === 0
                  ? "rounded-3xl border-volt/25 bg-graphite/70"
                  : "rounded-3xl border-white/10 bg-navy/60"
              }`}
            >
              <div>
                <p className="text-sm font-medium text-volt">
                  {service.eyebrow}
                </p>
                <h3 className="mt-4 max-w-xl text-2xl font-semibold leading-tight text-white sm:text-3xl">
                  {service.title}
                </h3>
                <p className="mt-4 max-w-xl leading-7 text-slate-300">
                  {service.description}
                </p>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-2">
                {service.steps.map((step, stepIndex) => (
                  <div key={step} className="flex items-center gap-2">
                    <span className="rounded-full border border-white/15 px-3 py-2 text-sm text-slate-200">
                      {step}
                    </span>
                    {stepIndex < service.steps.length - 1 ? (
                      <span aria-hidden="true" className="text-volt">
                        →
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
