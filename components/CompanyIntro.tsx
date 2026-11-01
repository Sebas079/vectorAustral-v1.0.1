import { companyContent } from "@/sources/content/company";

export default function CompanyIntro() {
  return (
    <section id="nosotros" className="px-6 py-12 sm:py-16">
      <div className="motion-rise mx-auto grid max-w-6xl gap-10 border-y border-white/10 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-14">
        <div>
          <p className="text-sm font-semibold text-volt">
            {companyContent.eyebrow}
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {companyContent.title}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-400">
            {companyContent.description}
          </p>
        </div>
        <aside className="border-l-2 border-volt/60 pl-6 sm:pl-8">
          <p className="text-2xl font-semibold text-white">
            {companyContent.name}
          </p>
          <p className="mt-1 text-sm text-volt">{companyContent.role}</p>
          <ul className="mt-6 space-y-3">
            {companyContent.experience.map((item) => (
              <li key={item} className="flex gap-3 text-slate-300">
                <span aria-hidden="true" className="text-volt">
                  +
                </span>
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
