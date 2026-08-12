import { createPageMetadata } from "@/lib/seo";
import { Quote } from "lucide-react";
import {
  Badge,
  Card,
  Container,
  Section,
  SectionHeader,
} from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { initials } from "@/lib/utils";
import { getPublicProjects } from "@/server/queries/public-content";
import { RealPhoto, SEP_PHOTOS } from "@/components/marketing/real-photo";

export const metadata = createPageMetadata({
  title: "Testimonios",
  description:
    "Historias reales de jóvenes de regiones del Perú que pasaron por SEP y hoy están construyendo en sus propias comunidades.",
  path: "/testimonios",
  keywords: ["jóvenes emprendedores Perú", "historias de emprendimiento", "testimonios SEP"],
});

/** ISR: la página se sirve estática y se regenera cada 5 min. */
export const revalidate = 300;

const stories = [
  {
    quote:
      "Compartí mi prototipo de Design Thinking con mi colegio esta semana. Los escolares llegaron con ideas increíbles para mejorar la biblioteca del barrio. Nunca subestimen a un chico de 15 años con una hoja en blanco.",
    name: "Andrea Núñez",
    region: "Arequipa",
    role: "Mentora SEP · Ingeniería Industrial",
  },
  {
    quote:
      "Vengo de una región sin recursos y la innovación social fue mi trampolín. Hoy hablo en conferencias de todo Latinoamérica.",
    name: "Valeria Ríos",
    region: "Bogotá, Colombia",
    role: "Speaker · Scrum y agilidad",
  },
  {
    quote:
      "Llegué sin experiencia a un taller de liderazgo. Hoy tengo mi propio programa y fui speaker en Star Lima.",
    name: "Jorge Medina",
    region: "Arequipa",
    role: "Liderazgo social",
  },
  {
    quote:
      "El mapa de empatía me voló la cabeza: llevaba meses asumiendo lo que necesitaba mi comunidad sin haberle preguntado nunca.",
    name: "Kevin Quispe",
    region: "Puno",
    role: "Economía · 2do ciclo",
  },
  {
    quote:
      "Mis estudiantes de 4to hicieron su primer prototipo con papel y cinta. Dos de ellos ahora quieren estudiar ingeniería. Eso no lo logré en veinte años de clase magistral.",
    name: "Rosa Chávez",
    region: "Casma, Áncash",
    role: "Directora · I.E. San Bartolomé",
  },
  {
    quote:
      "Desde Huánuco, primera sesión hecha y ya tengo tres ideas para el proyecto de residuos de mi barrio. Vamos con todo.",
    name: "Diego Paredes",
    region: "Huánuco",
    role: "Ingeniería Ambiental · 3ro",
  },
];

export default async function TestimoniosPage() {
  const projects = await getPublicProjects();

  return (
    <>
      <section className="border-b border-line bg-surface-1">
        <Container size="wide" className="py-14 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <SectionHeader
            eyebrow="La comunidad"
            title="Lo que dicen quienes ya pasaron por aquí"
            description="Sin retoques ni testimonios de stock. Personas reales de regiones reales."
          />
          <RealPhoto
            src={SEP_PHOTOS.community}
            alt="Comunidad SEP reunida al terminar una experiencia de aprendizaje"
            priority
            label="La comunidad detrás de las historias"
            className="aspect-[16/10] min-h-0"
            imageClassName="object-[50%_76%]"
          />
          </div>
        </Container>
      </section>

      <Section>
        <Container size="wide">
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((s) => (
              <li key={s.name}>
                <Card className="relative flex h-full flex-col overflow-hidden p-6 shadow-[0_10px_34px_-28px_rgba(18,16,28,.5)]">
                  <span className="absolute left-0 top-0 h-full w-1 sep-gradient" />
                  <Quote className="size-5 text-gold-500" />
                  <p className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-graphite">
                    {s.quote}
                  </p>
                  <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full sep-gradient text-xs font-semibold text-white">
                      {initials(s.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{s.name}</p>
                      <p className="truncate text-xs text-slate-ui">
                        {s.region} · {s.role}
                      </p>
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {projects.length > 0 && (
        <Section tone="muted">
          <Container size="wide">
            <SectionHeader
              eyebrow="Proyectos"
              title="Lo que están construyendo"
              description="Cada uno nació en un curso de SEP y hoy se ejecuta en su propia comunidad."
            />

            <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <li key={p.id}>
                  <Card className="flex h-full flex-col p-6">
                    {p.region && <Badge tone="brand">{p.region}</Badge>}
                    <h3 className="mt-3.5 font-display text-[1.0625rem] font-semibold text-ink">
                      {p.title}
                    </h3>
                    {p.problem && (
                      <p className="mt-3 text-xs uppercase tracking-[0.08em] text-slate-ui">
                        El problema
                      </p>
                    )}
                    {p.problem && (
                      <p className="mt-1 text-sm leading-relaxed text-slate-ui">
                        {p.problem}
                      </p>
                    )}
                    {p.solution && (
                      <>
                        <p className="mt-3 text-xs uppercase tracking-[0.08em] text-seed-700">
                          La solución
                        </p>
                        <p className="mt-1 flex-1 text-sm leading-relaxed text-graphite">
                          {p.solution}
                        </p>
                      </>
                    )}
                  </Card>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <Section className="py-14">
        <Container size="narrow">
          <Card className="text-center">
            <h2 className="font-display text-[1.5rem] font-semibold text-ink">
              La próxima historia puede ser la tuya
            </h2>
            <p className="mx-auto mt-2.5 max-w-md text-[0.9375rem] text-slate-ui">
              Los cursos son gratuitos y empiezan cada mes. No importa tu región ni tu
              punto de partida.
            </p>
            <Button href="/registro" variant="gradient" className="mt-6">
              Crear mi cuenta gratis
            </Button>
          </Card>
        </Container>
      </Section>
    </>
  );
}
