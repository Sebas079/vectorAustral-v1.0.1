import WhatsAppLink from "@/components/WhatsAppLink";
import { getWhatsAppHref } from "@/lib/contact/whatsapp";

export default function FloatingWhatsApp() {
  const href = getWhatsAppHref();

  if (!href) {
    return null;
  }

  return (
    <div className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] left-4 z-30 sm:bottom-5 sm:left-5">
      <WhatsAppLink href={href} floating />
    </div>
  );
}
