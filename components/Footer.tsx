import Image from "next/image";

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

export default function Footer() {
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`
    : undefined;

  return (
    <footer className="border-t border-white/10 bg-navy px-6 py-8 text-slate-400">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <a
            href="#inicio"
            aria-label="Vector Austral, volver al inicio"
            className="inline-block rounded-md focus:outline-none focus:ring-2 focus:ring-volt"
          >
            <Image
              src="/assets/brand/vector-austral-logo.svg"
              alt="Vector Austral"
              width="220"
              height="53"
              className="h-auto w-40 sm:w-44"
            />
          </a>
          <p className="mt-2 text-sm">
            Ingeniería digital para operaciones que necesitan escalar.
          </p>
        </div>

        <nav aria-label="Navegación del pie de página">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <li>
              <a
                href="#servicios"
                className="transition hover:text-volt focus:outline-none focus:ring-2 focus:ring-volt"
              >
                Servicios
              </a>
            </li>
            <li>
              <a
                href="#contacto"
                className="transition hover:text-volt focus:outline-none focus:ring-2 focus:ring-volt"
              >
                Contacto
              </a>
            </li>
            {contactEmail ? (
              <li>
                <a
                  href={`mailto:${contactEmail}`}
                  className="transition hover:text-volt focus:outline-none focus:ring-2 focus:ring-volt"
                >
                  Email
                </a>
              </li>
            ) : null}
            {whatsappHref ? (
              <li>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-volt focus:outline-none focus:ring-2 focus:ring-volt"
                >
                  WhatsApp
                </a>
              </li>
            ) : null}
          </ul>
        </nav>
      </div>

      <div className="mx-auto mt-6 max-w-6xl border-t border-white/10 pt-5 text-xs text-slate-500">
        © {new Date().getFullYear()} Vector Austral. Todos los derechos
        reservados.
      </div>
    </footer>
  );
}
