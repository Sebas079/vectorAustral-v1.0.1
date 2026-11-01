import Image from "next/image";

import { getWhatsAppHref } from "@/lib/contact";

export default function WhatsAppFloatingButton() {
  const whatsappHref = getWhatsAppHref();

  if (!whatsappHref) {
    return null;
  }

  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noreferrer"
      aria-label="Hablar por WhatsApp"
      className="fixed bottom-5 left-5 z-20 inline-flex min-h-14 items-center gap-3 rounded-full border border-emerald-300/30 bg-emerald-500 px-4 font-semibold text-emerald-950 shadow-lg shadow-black/30 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-abyss"
    >
      <span aria-hidden="true" className="grid size-8 place-items-center">
        <Image
          src="/assets/brand/whatsapp-brands-solid-full.svg"
          alt=""
          width={28}
          height={28}
        />
      </span>
      <span className="hidden sm:inline">Hablar por WhatsApp</span>
      <span className="sm:hidden">WhatsApp</span>
    </a>
  );
}
