// El proceso comunica una secuencia concreta, no una promesa genérica.
export const processContent = {
  eyebrow: "Cómo trabajamos",
  title: "Un proceso simple, claro y orientado a resultados.",
  description:
    "Nos enfocamos en entender el problema real y entregar una solución útil, rápida y escalable.",
  steps: [
    {
      number: "01",
      title: "Diagnóstico",
      description:
        "Analizamos el negocio, los objetivos y las fricciones para definir la solución correcta.",
    },
    {
      number: "02",
      title: "Diseño y desarrollo",
      description:
        "Construimos desde la arquitectura hasta la interfaz con foco en rendimiento, claridad y crecimiento.",
    },
    {
      number: "03",
      title: "Implementación y escalado",
      description:
        "Entregamos, optimizamos y conectamos cada parte para que la solución siga funcionando mejor.",
    },
  ],
} as const;
