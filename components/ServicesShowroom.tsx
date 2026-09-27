import { differentiators, servicesContent } from "@/sources/content/services";
import { landingContent } from "@/sources/content/landing";

export default function ServicesShowroom() {
  return (
    <section id="servicios" className="px-6 py-12 text-slate-100 sm:py-16">
      <div className="motion-rise mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold tracking-[0.2em] text-volt">
            Capacidades
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Ingeniería digital pensada para la eficiencia operacional.
          </h2>
          <p className="mt-5 max-w-2xl leading-7 text-slate-300">
            {landingContent.diagnostic.description}
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {servicesContent.map((service) => (
            <article
              key={service.id}
              className="flex min-h-64 flex-col justify-between rounded-3xl border border-white/10 bg-graphite/55 p-6 shadow-lg shadow-blue-950/10 transition hover:-translate-y-1 hover:border-volt/30 hover:shadow-2xl hover:shadow-cyan-950/20 sm:p-8"
            >
              <div>
                <p className="text-sm font-medium tracking-wide text-volt">
                  {service.outcome}
                </p>
                <h3 className="mt-4 text-2xl font-semibold leading-tight text-white">
                  {service.title}
                </h3>
                <p className="mt-5 leading-7 text-slate-300">
                  {service.description}
                </p>
              </div>
              <span className="mt-6 text-sm text-slate-500">
                Solución pensada para crecer
              </span>
            </article>
          ))}
        </div>

        <div className="mt-20 border-t border-white/10 pt-10">
          <h2 className="text-3xl font-semibold text-white">
            Arquitectura estable. Resultados medibles.
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {differentiators.map((item) => (
              <article key={item.title}>
                <h3 className="text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-3 leading-7 text-slate-400">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
