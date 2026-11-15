export interface ServiceContent {
  id: "automation" | "ecommerce";
  eyebrow: string;
  title: string;
  description: string;
  steps: string[];
}

export const servicesContent: ServiceContent[] = [
  {
    id: "automation",
    eyebrow: "Ejemplo de flujo · n8n",
    title: "Una consulta, registrada sin volver a cargar los datos.",
    description:
      "Cuando llega un mensaje por WhatsApp, el flujo puede guardar los datos en Google Sheets y crear o actualizar el contacto en el CRM.",
    steps: ["WhatsApp", "Google Sheets", "CRM"],
  },
  {
    id: "ecommerce",
    eyebrow: "Ejemplo de tienda · SEO local",
    title: "Una tienda online rápida y fácil de encontrar en tu zona.",
    description:
      "Un catálogo claro, una compra simple y páginas preparadas para búsquedas locales ayudan a que más personas encuentren tus productos y consulten.",
    steps: ["Catálogo claro", "Compra simple", "SEO local"],
  },
];
