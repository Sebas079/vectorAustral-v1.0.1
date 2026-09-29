export interface KnowledgeEntry {
  id: "web" | "automation" | "diagnostic" | "process";
  title: string;
  keywords: string[];
  response: string;
}

export const knowledgeBase: KnowledgeEntry[] = [
  {
    id: "web",
    title: "Desarrollo web escalable",
    keywords: ["web", "sitio", "plataforma", "página", "pagina", "escalable"],
    response:
      "Desarrollamos plataformas y sitios web rápidos, seguros y preparados para escalar. Enfocamos cada desarrollo en la velocidad, la seguridad y una experiencia optimizada para convertir tráfico cualificado en oportunidades B2B.",
  },
  {
    id: "automation",
    title: "Automatización con n8n",
    keywords: [
      "n8n",
      "automatización",
      "automatizacion",
      "flujo",
      "crm",
      "erp",
      "api",
    ],
    response:
      "Conectamos CRM, ERP, bases de datos y APIs mediante flujos robustos en n8n. Las automatizaciones pueden ejecutarse en infraestructura propia o gestionada, con control de datos y estabilidad operacional.",
  },
  {
    id: "diagnostic",
    title: "Diagnóstico Inicial",
    keywords: [
      "diagnóstico",
      "diagnostico",
      "auditoría",
      "auditoria",
      "viabilidad",
      "roi",
      "ineficiencia",
    ],
    response:
      "El Diagnóstico Inicial evalúa procesos críticos, arquitectura web y viabilidad de integración para priorizar oportunidades de impacto. Es el primer paso para definir una hoja de ruta técnica.",
  },
  {
    id: "process",
    title: "Proceso de trabajo",
    keywords: [
      "proceso",
      "cómo",
      "como",
      "trabajo",
      "implementación",
      "implementacion",
    ],
    response:
      "Comenzamos entendiendo tu operación y su arquitectura actual. Luego identificamos oportunidades, evaluamos viabilidad y definimos una hoja de ruta de implementación sostenible.",
  },
];

export const pricingKeywords = [
  "precio",
  "precios",
  "presupuesto",
  "presupuestos",
  "cotización",
  "cotizacion",
  "cuánto cuesta",
  "cuanto cuesta",
  "costo",
  "coste",
];

export const fallbackResponse =
  "No tengo información suficiente para responder eso sin inventar datos. Podés solicitar un Diagnóstico Inicial y un especialista revisará tu caso.";

export const pricingResponse =
  "No realizo presupuestos automáticos. Solicita un Diagnóstico Inicial y un especialista te cotiza según tus requerimientos.";
