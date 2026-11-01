export function getWhatsAppHref(
  phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
) {
  const digits = phoneNumber?.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : undefined;
}
