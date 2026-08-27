import { Bot, BrainCircuit, ShieldCheck } from "lucide-react";
import { createPageMetadata } from "@/lib/seo";
import { aiDesignThinkingAudiences } from "@/config/programs";
import {
  ProgramAudience,
  ProgramBenefits,
  ProgramCTA,
  ProgramCurriculum,
  ProgramFAQ,
  ProgramHero,
  ProgramRequirements,
  ProgramTimeline,
} from "@/components/marketing/program";
import { RealPhoto, SEP_PHOTOS } from "@/components/marketing/real-photo";

export const metadata = createPageMetadata({
  title: "AI Design Thinking para universitarios y docentes",
  description:
    "Programa virtual de seis clases para convertir problemas reales en prototipos responsables con Design Thinking e inteligencia artificial.",
  path: "/ai-design-thinking",
  keywords: [
    "AI Design Thinking Perú",
    "inteligencia artificial para docentes",
    "Design Thinking para universitarios",
  ],
});

export default function AiDesignThinkingPage() {
  return (
    <>
      <ProgramHero
        eyebrow="Nuevo programa SEP"
        title={<>AI Design Thinking</>}
        description="Aprende a investigar un reto, idear con criterio y construir un prototipo con apoyo de IA. No vienes a mirar herramientas: vienes a resolver un problema real."
        facts={["6 clases en vivo", "1 h 20 min por clase", "100 % virtual", "Dos recorridos"]}
        primaryAction={{ label: "Elegir mi recorrido", href: "#audiencias" }}
        secondaryAction={{ label: "Revisar el programa", href: "#universitarios" }}
        aside={
          <RealPhoto
            src={SEP_PHOTOS.methodology}
            alt="Participantes de SEP trabajando en equipo con herramientas de ideación"
            priority
            label="Metodología aplicada en comunidad"
            className="aspect-[4/3] min-h-0 border border-white/20"
            sizes="(min-width: 1024px) 42vw, 100vw"
          />
        }
      />

      <ProgramAudience audiences={aiDesignThinkingAudiences} />

      <ProgramTimeline
        steps={[
          { title: "Entiende", description: "Observa, entrevista y define un reto desde la experiencia de las personas." },
          { title: "Crea", description: "Genera alternativas con creatividad humana y apoyo responsable de IA." },
          { title: "Prueba", description: "Construye, recibe feedback, itera y presenta una siguiente acción clara." },
        ]}
      />

      {aiDesignThinkingAudiences.map((audience) => (
        <ProgramCurriculum key={audience.id} audience={audience} />
      ))}

      <ProgramBenefits
        benefits={[
          {
            title: "Un proyecto demostrable",
            description: "Documentas el problema, las decisiones, el prototipo y el feedback en un entregable final.",
          },
          {
            title: "IA con criterio",
            description: "Aprendes cuándo usarla, cómo verificar resultados y qué información nunca deberías compartir.",
          },
          {
            title: "Aplicación inmediata",
            description: "El recorrido universitario trabaja con usuarios reales; el docente lleva el prototipo a su aula.",
          },
        ]}
      />

      <ProgramRequirements
        items={[
          "Un problema o desafío que te interese explorar.",
          "Conexión para participar en las seis sesiones virtuales.",
          "Disponibilidad para realizar actividades breves entre clases.",
          "Compromiso con la privacidad, la verificación y el uso responsable de IA.",
        ]}
      />

      <section className="border-y border-line bg-white py-16 md:py-20">
        <div className="mx-auto grid w-full max-w-content gap-8 px-4 sm:px-6 md:grid-cols-3 md:px-8">
          {[
            { icon: BrainCircuit, title: "La IA acompaña", text: "Amplía opciones y acelera tareas; no sustituye tu criterio ni la voz de las personas." },
            { icon: ShieldCheck, title: "Privacidad primero", text: "El programa incorpora principios éticos de UNESCO sobre datos, sesgos y responsabilidad." },
            { icon: Bot, title: "Herramientas accesibles", text: "Se priorizan opciones gratuitas o de bajo costo para no ampliar la brecha digital." },
          ].map((item) => (
            <div key={item.title}>
              <item.icon className="size-6 text-sep-600" />
              <h2 className="mt-4 font-display text-h4 font-semibold text-ink">{item.title}</h2>
              <p className="mt-2 text-body-sm text-slate-ui">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <ProgramFAQ
        items={[
          {
            question: "¿Universitarios y docentes llevan las mismas clases?",
            answer: "Comparten la estructura de seis clases, pero trabajan actividades, ejemplos, tareas y entregables adaptados a su realidad.",
          },
          {
            question: "¿Necesito experiencia previa en inteligencia artificial?",
            answer: "No. El recorrido empieza con fundamentos y se enfoca en usar la IA como apoyo dentro de un proceso de diseño centrado en personas.",
          },
          {
            question: "¿Cuándo empieza la próxima edición?",
            answer: "El equipo SEP publicará el calendario confirmado antes de abrir postulaciones. Puedes crear tu cuenta para quedar listo y recibir novedades.",
          },
          {
            question: "¿Qué ocurre después de registrarme?",
            answer: "Completarás tu perfil SEP. Cuando la convocatoria abra, verás las instrucciones y el recorrido correspondiente a tu tipo de cuenta.",
          },
        ]}
      />

      <ProgramCTA
        title="Prepara tu cuenta para la próxima convocatoria"
        description="Elige el perfil que te corresponde. No publicamos fechas hasta que el cronograma esté confirmado por el equipo SEP."
        actions={[
          { label: "Soy universitario", href: "/registro/estudiante" },
          { label: "Soy docente", href: "/registro/docente" },
        ]}
      />
    </>
  );
}
