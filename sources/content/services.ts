// Estos textos son la fuente única que consumen las tarjetas de servicios.
export interface ServiceContent {
  id: "automation" | "web";
  title: string;
  description: string;
  outcome: string;
}

export const servicesContent: ServiceContent[] = [
  {
    id: "automation",
    title:
      "Unifica tus sistemas sin depender de licencias privativas desproporcionadas.",
    description:
      "Conectamos tus herramientas (CRM, ERP, bases de datos y APIs) mediante flujos de trabajo robustos en n8n. Diseñamos automatizaciones a medida, ejecutables en infraestructura propia o gestionada, garantizando control total de los datos, estabilidad operacional y cero costes redundantes por volumen de tareas.",
    outcome: "Automatización de flujos de trabajo con n8n",
  },
  {
    id: "web",
    title: "Plataformas web rápidas, seguras y diseñadas para convertir.",
    description:
      "Desarrollamos plataformas y sitios web bajo estándares modernos de arquitectura software. Enfocamos cada desarrollo en la velocidad de carga, la seguridad de la información y una experiencia de usuario optimizada para transformar tráfico cualificado en oportunidades comerciales B2B.",
    outcome: "Desarrollo web escalable",
  },
];

export const differentiators = [
  {
    title: "Escalabilidad real",
    description:
      "Sistemas preparados para soportar el incremento de operaciones sin degradar el rendimiento.",
  },
  {
    title: "Transparencia técnica",
    description:
      "Documentación clara y soluciones sostenibles, sin promesas irrealizables ni cajas negras.",
  },
  {
    title: "Eficiencia y ROI",
    description:
      "Cada flujo y cada línea de código responde a un objetivo de negocio claro.",
  },
] as const;
