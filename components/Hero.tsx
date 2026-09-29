import { landingContent } from "@/sources/content/landing";

export default function Hero() {
  const { hero } = landingContent;

  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-16 text-slate-100 sm:pb-24 sm:pt-24">
      <div className="pointer-events-none absolute -right-32 top-8 size-96 rounded-full bg-volt/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="motion-rise">
          <p className="mb-6 inline-flex rounded-full border border-volt/30 bg-volt/10 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-volt">
            {hero.eyebrow}
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
            {hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400 sm:text-xl">
            {hero.description}
          </p>
          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <a
              href="#contacto"
              className="rounded-full bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-volt focus:ring-offset-2 focus:ring-offset-abyss"
            >
              {hero.cta}
            </a>
            <a
              href="#servicios"
              className="rounded-full border border-white/15 px-6 py-3.5 font-semibold text-slate-200 transition hover:border-volt/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-volt"
            >
              Ver servicios
            </a>
            <a
              href="#demo"
              className="rounded-full border border-volt/40 bg-volt/10 px-6 py-3.5 font-semibold text-volt transition hover:border-volt hover:bg-volt/15 focus:outline-none focus:ring-2 focus:ring-volt"
            >
              {hero.demoCta}
            </a>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-6 text-slate-500">
            {hero.support}
          </p>
        </div>

        <div className="motion-rise motion-rise-delay rounded-3xl border border-white/10 bg-graphite/60 p-6 shadow-2xl shadow-blue-950/30 backdrop-blur">
          <div className="rounded-2xl border border-volt/20 bg-gradient-to-br from-volt/10 via-navy to-blue-600/10 p-6">
            <p className="text-sm font-semibold tracking-[0.18em] text-volt">
              Qué construimos
            </p>
            <div className="mt-6 space-y-4">
              {hero.highlights.map(({ title, description }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/10 bg-navy/80 p-4"
                >
                  <p className="text-xs tracking-[0.18em] text-slate-500">
                    {title}
                  </p>
                  <p className="mt-2 text-lg font-semibold leading-7 text-white">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
