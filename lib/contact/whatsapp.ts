const initialMessage = "Hola, quiero hacer una consulta sobre sus servicios.";

export function getWhatsAppHref(): string | undefined {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(
    /\D/g,
    "",
  );

  if (!phoneNumber || phoneNumber.length < 8 || phoneNumber.length > 15) {
    return undefined;
  }

  const query = new URLSearchParams({ text: initialMessage });
  return `https://wa.me/${phoneNumber}?${query.toString()}`;
}
