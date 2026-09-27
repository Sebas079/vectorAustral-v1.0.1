import { processContent } from "@/sources/content/process";

export default function ProcessSection() {
  return (
    <section id="proceso" className="px-6 py-12 sm:py-16">
      <div className="motion-rise mx-auto grid max-w-6xl gap-8 rounded-3xl border border-white/10 bg-gradient-to-br from-graphite/60 via-abyss to-navy p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-volt">
            {processContent.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {processContent.title}
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-8 text-slate-400">
            {processContent.description}
          </p>
        </div>
        <div className="space-y-4">
          {processContent.steps.map((step) => (
            <article
              key={step.number}
              className="flex gap-4 rounded-2xl border border-white/10 bg-navy/70 p-5"
            >
              <p className="shrink-0 text-sm font-semibold text-volt">
                {step.number}
              </p>
              <div>
                <h3 className="font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-400">
                  {step.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
