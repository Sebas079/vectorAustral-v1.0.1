interface WhatsAppLinkProps {
  href: string;
  className?: string;
  floating?: boolean;
}

export default function WhatsAppLink({
  href,
  className = "",
  floating = false,
}: WhatsAppLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Abrir chat de WhatsApp"
      title="WhatsApp"
      className={`inline-flex size-11 shrink-0 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt sm:size-12 ${
        floating
          ? "bg-[#25D366] text-[#062b18] shadow-lg shadow-black/30 hover:bg-[#22c55e] focus-visible:ring-offset-2 focus-visible:ring-offset-abyss"
          : "bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20"
      } ${className}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className="size-5 sm:size-6"
      >
        <path
          d="M20.2 11.7a8.2 8.2 0 0 1-12.1 7.2L3.5 20l1.1-4.4a8.2 8.2 0 1 1 15.6-3.9Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M8.2 7.8c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.8 1.8c.1.2.1.4 0 .6l-.6.7c-.2.2-.2.4-.1.6.5.9 1.2 1.6 2.1 2.1.2.1.4.1.6-.1l.8-.9c.2-.2.4-.2.6-.1l1.7.8c.2.1.4.2.4.5 0 .4-.2 1.2-.8 1.6-.5.4-1.1.6-1.8.4-1-.3-2.3-.9-3.6-2.1-1-.9-1.8-2-2.2-3.2-.4-1.1.2-2.2.4-2.7Z"
          fill="currentColor"
        />
      </svg>
    </a>
  );
}
