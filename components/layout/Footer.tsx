export default function Footer() {
  return (
    <footer className="mt-12 w-full border-t border-gray-800 bg-transparent py-8">
      <div className="mx-auto max-w-7xl px-6 text-center text-sm text-gray-400">
          <div className="mb-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <img src="/sources/logo.svg" alt="Vector Austral" className="h-8 w-auto" />
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-3">
            <a href="#nosotros" className="text-sm hover:text-cyan-300">Nosotros</a>
            <a href="#servicios" className="text-sm hover:text-cyan-300">Servicios</a>
            <a href="#clientes" className="text-sm hover:text-cyan-300">Clientes</a>
            <a href="#contacto" className="text-sm hover:text-cyan-300">Contacto</a>
          </nav>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Vector Austral — Soluciones web, apps y automatizaciones.</p>
          <p className="mt-2">Contacto: <a href="mailto:contacto@vectoraustral.com" className="text-cyan-300">contacto@vectoraustral.com</a></p>
        </div>
      </div>
    </footer>
  )
}
