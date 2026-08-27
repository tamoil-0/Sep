export type ProgramSession = {
  number: number;
  title: string;
  learning: string;
  activity: string;
  materials: string[];
  task: string;
  duration: string;
};

export type ProgramAudience = {
  id: string;
  label: string;
  summary: string;
  outcome: string;
  signupHref: string;
  sessions: ProgramSession[];
};

const shared = {
  duration: "1 h 20 min",
};

export const aiDesignThinkingAudiences: ProgramAudience[] = [
  {
    id: "universitarios",
    label: "Universitarios",
    summary: "Convierte un problema real de tu entorno en una solución validada con personas.",
    outcome: "Terminas con un portafolio del proceso, un prototipo y un plan de acción.",
    signupHref: "/registro/estudiante",
    sessions: [
      {
        ...shared,
        number: 1,
        title: "Introducción a IA y Design Thinking",
        learning: "Comprenderás los fundamentos y aprenderás a explorar un problema desde la empatía.",
        activity: "Entrevistas a usuarios y exploración de herramientas de IA para entender el problema.",
        materials: ["Presentación IA + DT", "Mapa de empatía", "Guía de entrevistas"],
        task: "Entrevistar a 2 personas y probar 2 herramientas de IA relacionadas.",
      },
      {
        ...shared,
        number: 2,
        title: "Definición del problema: POV con IA",
        learning: "Sintetizarás información y formularás un problema centrado en la persona.",
        activity: "Definición del POV y exploración de soluciones posibles con IA.",
        materials: ["Plantilla POV", "Catálogo de herramientas", "Guía de síntesis"],
        task: "Redactar tu POV e identificar 3 herramientas que podrían ayudarte.",
      },
      {
        ...shared,
        number: 3,
        title: "Ideación: soluciones creativas con IA",
        learning: "Combinarás creatividad humana e IA para generar y priorizar alternativas.",
        activity: "Crazy 8s, expansión de ideas con IA y matriz de impacto-viabilidad.",
        materials: ["Plantilla de ideación", "Prompts para IA", "Matriz de priorización"],
        task: "Generar 5 ideas adicionales y elegir 1 para prototipar.",
      },
      {
        ...shared,
        number: 4,
        title: "Prototipado con IA: de la idea a la acción",
        learning: "Crearás un prototipo rápido que puedas poner frente a usuarios.",
        activity: "Construcción de un sketch, maqueta, plan de acción o recurso digital.",
        materials: ["Guía de prototipado", "Ejemplos", "Herramientas de IA"],
        task: "Construir tu prototipo y planificar cómo lo probarás.",
      },
      {
        ...shared,
        number: 5,
        title: "Testeo, aprendizaje rápido y ética de IA",
        learning: "Recogerás feedback, iterarás y reconocerás riesgos de privacidad y sesgo.",
        activity: "Prueba con usuarios y conversación guiada sobre uso responsable de IA.",
        materials: ["Plantilla de feedback", "Guía ética UNESCO", "Rúbrica de evaluación"],
        task: "Probar con 2 usuarios, registrar feedback y reflexionar sobre ética.",
      },
      {
        ...shared,
        number: 6,
        title: "Presentación de proyectos y siguientes pasos",
        learning: "Sintetizarás el proceso y prepararás la evolución de tu solución.",
        activity: "Feria de proyectos: desafío, solución con IA y aprendizajes.",
        materials: ["Plantilla de presentación", "Plan de acción", "Guía de escalabilidad"],
        task: "Entregar el portafolio final, prototipo, reflexión ética y plan de acción.",
      },
    ],
  },
  {
    id: "docentes",
    label: "Docentes",
    summary: "Diseña una solución educativa con IA que puedas probar dentro de tu aula.",
    outcome: "Terminas con un prototipo aplicado, feedback de estudiantes y un plan para escalarlo.",
    signupHref: "/registro/docente",
    sessions: [
      {
        ...shared,
        number: 1,
        title: "IA y Design Thinking en educación",
        learning: "Identificarás oportunidades de IA en el aula partiendo de necesidades reales.",
        activity: "Mapa de necesidades de estudiantes y exploración de herramientas educativas.",
        materials: ["Presentación IA + DT", "Guía de IA educativa", "Mapa de empatía"],
        task: "Probar 2 herramientas y registrar cómo podrían ayudar a tus estudiantes.",
      },
      {
        ...shared,
        number: 2,
        title: "Definición del desafío educativo con IA",
        learning: "Formularás un desafío educativo centrado en la experiencia del estudiante.",
        activity: "Ejercicio POV y exploración de posibles apoyos con IA.",
        materials: ["Plantilla POV", "Ejemplos educativos", "Catálogo de herramientas"],
        task: "Redactar el POV e identificar 3 herramientas que podrían ayudar.",
      },
      {
        ...shared,
        number: 3,
        title: "Ideación: soluciones creativas con IA",
        learning: "Generarás soluciones combinando criterio docente y capacidades de IA.",
        activity: "Técnica de 100 ideas y refinamiento de alternativas con IA.",
        materials: ["Plantilla de ideación", "Prompts para IA", "Guía de co-creación"],
        task: "Generar 10 ideas adicionales y elegir 1 para prototipar.",
      },
      {
        ...shared,
        number: 4,
        title: "Prototipado rápido con IA en el aula",
        learning: "Crearás un recurso, actividad o plan de clase de bajo costo.",
        activity: "Construcción del prototipo con apoyo de herramientas de IA.",
        materials: ["Guía de prototipado", "Ejemplos educativos", "Checklist"],
        task: "Construir el prototipo y planificar su aplicación en el aula.",
      },
      {
        ...shared,
        number: 5,
        title: "Testeo, retroalimentación y ética de IA",
        learning: "Recogerás feedback y evaluarás privacidad, sesgos y uso responsable.",
        activity: "Simulación de aplicación y conversación ética basada en casos.",
        materials: ["Plantilla de feedback", "Guía ética UNESCO", "Rúbrica de evaluación"],
        task: "Aplicar el prototipo y recoger feedback de 3 estudiantes.",
      },
      {
        ...shared,
        number: 6,
        title: "Presentación y plan de acción",
        learning: "Presentarás el prototipo y definirás cómo sostenerlo o ampliarlo.",
        activity: "Presentación del desafío, la solución con IA y los aprendizajes.",
        materials: ["Plantilla de presentación", "Plan de acción", "Guía de escalabilidad"],
        task: "Entregar reporte, feedback, reflexión ética y plan de acción.",
      },
    ],
  },
];
