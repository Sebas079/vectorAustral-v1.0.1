import Image from "next/image";

const navigationItems = [
  { href: "#inicio", label: "Inicio" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#servicios", label: "Servicios" },
  { href: "#proceso", label: "Proceso" },
  { href: "#contacto", label: "Diagnóstico Inicial" },
];

function NavigationLinks() {
  return (
    <>
      {navigationItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="rounded-md px-3 py-2 text-sm text-slate-300 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-volt"
        >
          {item.label}
        </a>
      ))}
    </>
  );
}

export default function Navbar() {
  return (
    <header className="sticky top-4 z-30 mx-4 rounded-full border border-white/10 bg-navy/90 px-4 shadow-lg shadow-blue-950/20 backdrop-blur sm:mx-8 lg:mx-auto lg:max-w-6xl">
      <div className="mx-auto flex min-h-18 max-w-6xl items-center justify-between gap-6">
        <a
          href="#inicio"
          aria-label="Vector Austral, volver al inicio"
          className="shrink-0 rounded-md focus:outline-none focus:ring-2 focus:ring-volt"
        >
          <Image
            src="/assets/brand/vector-austral-logo.svg"
            alt="Vector Austral"
            width="220"
            height="53"
            className="h-auto w-40 sm:w-48"
          />
        </a>

        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-1 md:flex"
        >
          <NavigationLinks />
        </nav>

        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none rounded-md border border-white/15 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-volt hover:text-white focus:outline-none focus:ring-2 focus:ring-volt">
            Menú
          </summary>
          <nav
            aria-label="Navegación principal móvil"
            className="absolute right-0 top-12 flex min-w-52 flex-col gap-1 border border-white/10 bg-abyss p-2 shadow-xl shadow-black/30"
          >
            <NavigationLinks />
          </nav>
        </details>
      </div>
    </header>
  );
}
