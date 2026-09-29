import { companyContent } from "@/sources/content/company";

export default function CompanyIntro() {
  return (
    <section id="nosotros" className="px-6 py-12 sm:py-16">
      <div className="motion-rise mx-auto grid max-w-6xl gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-graphite/70 via-graphite/40 to-navy p-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:p-10">
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-volt">
            {companyContent.eyebrow}
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {companyContent.title}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-400">
            {companyContent.description}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {companyContent.signals.map((signal) => (
            <div
              key={signal.label}
              className="rounded-2xl border border-white/10 bg-navy/70 p-5 text-center"
            >
              <p className="text-2xl font-semibold text-white">
                {signal.value}
              </p>
              <p className="mt-1 text-sm text-slate-400">{signal.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
