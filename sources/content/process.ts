// El proceso comunica una secuencia concreta, no una promesa genérica.
export const processContent = {
  eyebrow: "Cómo trabajamos",
  title: "Primero entendemos el problema. Después elegimos qué hacer.",
  description:
    "Cada negocio trabaja distinto. Por eso arrancamos por lo que hoy te quita tiempo o te hace perder consultas.",
  steps: [
    {
      number: "01",
      title: "Conversamos",
      description: "Nos contás cómo trabajás y qué parte querés mejorar.",
    },
    {
      number: "02",
      title: "Definimos una solución",
      description:
        "Revisamos las herramientas que ya usás y acordamos qué conviene conectar o construir.",
    },
    {
      number: "03",
      title: "La ponemos en marcha",
      description:
        "Implementamos la solución y revisamos con vos cómo funciona en el trabajo diario.",
    },
  ],
} as const;
