import { institutionalDemo } from "@/sources/content/demos";

export default function DemoVideo() {
  return (
    <section id="demo" className="px-6 py-12 sm:py-16">
      <div className="motion-rise mx-auto grid max-w-6xl gap-8 rounded-3xl border border-white/10 bg-graphite/50 p-6 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:p-10">
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-volt">
            {institutionalDemo.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {institutionalDemo.title}
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-8 text-slate-400">
            {institutionalDemo.description}
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-navy shadow-2xl shadow-cyan-950/20">
          {/* El video se difiere hasta que el visitante interactúa con el reproductor. */}
          <video
            className="aspect-video w-full"
            controls
            preload="none"
            poster={institutionalDemo.posterSrc}
            playsInline
          >
            <source src={institutionalDemo.videoSrc} type="video/mp4" />
            Tu navegador no puede reproducir este video. Podés conocer los
            servicios desde la sección de contacto.
          </video>
        </div>
      </div>
    </section>
  );
}
