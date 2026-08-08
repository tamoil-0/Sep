import Link from "next/link";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Building2,
  CalendarDays,
  Check,
  Clock,
  GraduationCap,
  Globe,
  Handshake,
  Lightbulb,
  MessageCircle,
  Mic,
  School,
  Sparkles,
  Sprout,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Badge,
  Card,
  Container,
  GoldUnderline,
  Section,
  SectionHeader,
} from "@/components/ui/primitives";
import { CountUp } from "@/components/marketing/count-up";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { NewsletterForm } from "@/components/marketing/newsletter-form";
import {
  faqs,
  impactChain,
  impactStats,
  partners,
  problemStats,
  siteConfig,
} from "@/config/site";
import { courses, silp } from "@/config/courses";
import { certificateTypes } from "@/config/pricing";
import { schoolBenefits, volunteerRoles } from "@/config/volunteering";
import { formatSoles } from "@/lib/utils";

export default function HomePage() {
  return (
    <>
      {/* ═══ 1 · HERO ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden sep-gradient">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 size-[520px] rounded-full bg-white/10 blur-3xl"
        />

        <Container size="wide" className="relative py-20 sm:py-28">
          <div className="max-w-3xl">
            <Badge tone="white">
              <BadgeCheck className="size-3.5" />
              Reconocidos por SENAJU · Desde Áncash para el Perú
            </Badge>

            <h1 className="mt-6 font-display text-[2.75rem] font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-[4rem] lg:text-[4.5rem]">
              Emprende hoy,
              <br />
              <span className="text-gold-500">lidera mañana.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80 sm:text-xl">
              Democratizamos metodologías ágiles para jóvenes universitarios y docentes de
              todas las regiones del Perú.{" "}
              <strong className="font-semibold text-white">
                100 % virtual y gratuito, siempre.
              </strong>
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href="/registro" variant="gold" size="lg">
                Empezar gratis
                <ArrowRight className="size-4" />
              </Button>
              <Button href="/cursos" variant="outline-white" size="lg">
                Ver los cursos
              </Button>
            </div>

            <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/60">
              <span className="inline-flex items-center gap-1.5">
                <Check className="size-4 text-gold-500" /> Sin costo de acceso
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="size-4 text-gold-500" /> Desde cualquier región
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="size-4 text-gold-500" /> Certificado opcional
              </span>
            </p>
          </div>
        </Container>

        {/* ═══ 2 · MÉTRICAS ══════════════════════════════════ */}
        <div className="relative border-t border-white/12">
          <Container size="wide">
            <dl className="grid grid-cols-2 gap-y-8 py-10 sm:grid-cols-3 lg:grid-cols-5">
              {impactStats.map((stat) => (
                <div key={stat.label}>
                  <dd className="tabular font-display text-[2rem] font-semibold leading-none text-gold-500 sm:text-[2.25rem]">
                    <CountUp
                      value={stat.value}
                      prefix={"prefix" in stat ? stat.prefix : ""}
                      suffix={"suffix" in stat ? stat.suffix : ""}
                    />
                  </dd>
                  <dt className="mt-2 text-[0.8125rem] leading-snug text-white/65">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </Container>
        </div>
      </section>

      {/* ═══ 3 · EL PROBLEMA ═════════════════════════════════ */}
      <Section>
        <Container size="wide">
          <SectionHeader
            eyebrow="El problema que resolvemos"
            title={
              <>
                El talento está en regiones. Las{" "}
                <GoldUnderline>oportunidades</GoldUnderline> se quedan en Lima.
              </>
            }
            description="Tres brechas que dejan fuera a miles de jóvenes cada año. Datos del ecosistema peruano de innovación."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {problemStats.map((item) => (
              <Card key={item.title} className="flex flex-col">
                <p className="tabular font-display text-[3rem] font-bold leading-none sep-gradient-text">
                  {item.figure}
                </p>
                <h3 className="mt-5 text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-slate-ui">
                  {item.body}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* ═══ 4 · CADENA DE IMPACTO ═══════════════════════════ */}
      <Section tone="muted">
        <Container size="wide">
          <SectionHeader
            eyebrow="Cómo generamos impacto"
            title="Un modelo de impacto en cadena"
            description="Formamos universitarios en su propia región. Ellos vuelven a los colegios de su comunidad como mentores. El conocimiento se multiplica sin que nadie tenga que migrar a Lima."
            align="center"
          />

          <ol className="mt-14 grid gap-4 md:grid-cols-4">
            {impactChain.map((node, i) => (
              <li key={node.step} className="relative">
                <div className="h-full rounded-[14px] border border-line bg-white p-6">
                  <span className="tabular text-xs font-semibold tracking-[0.14em] text-gold-600">
                    0{i + 1}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-semibold text-ink">
                    {node.step}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-ui">
                    {node.detail}
                  </p>
                </div>

                {i < impactChain.length - 1 && (
                  <ArrowRight
                    aria-hidden
                    className="absolute -right-3.5 top-1/2 hidden size-6 -translate-y-1/2 text-gold-500 md:block"
                  />
                )}
              </li>
            ))}
          </ol>

          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-slate-ui">
            Los universitarios también crean proyectos propios de innovación social e
            integran las áreas funcionales de SEP: formación, alianzas, comunicación y
            gestión.
          </p>
        </Container>
      </Section>

      {/* ═══ 5 · CURSOS ══════════════════════════════════════ */}
      <Section id="cursos">
        <Container size="wide">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeader
              eyebrow="Catálogo"
              title="Cursos gratuitos, siempre"
              description="2 semanas · interdiario · 2 h por sesión · 8 horas totales · 100 % virtual. El curso no cuesta nada; el certificado es opcional."
            />
            <Button href="/cursos" variant="outline">
              Ver catálogo completo
              <ArrowRight className="size-4" />
            </Button>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((course) => (
              <Card
                key={course.slug}
                interactive
                className="flex flex-col p-5"
                as={Link}
                {...{ href: `/cursos/${course.slug}` }}
              >
                <div className="flex items-center gap-2">
                  {course.status === "disponible" ? (
                    <Badge tone="seed">Disponible</Badge>
                  ) : (
                    <Badge tone="neutral">Próximamente</Badge>
                  )}
                  {course.audience === "docente" && <Badge tone="gold">Docentes</Badge>}
                </div>

                <h3 className="mt-4 font-display text-[1.0625rem] font-semibold leading-snug text-ink">
                  {course.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-ui">
                  {course.description}
                </p>

                <dl className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-line pt-4 text-xs text-slate-ui">
                  <div className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5 text-mist" />
                    {course.totalHours} h
                  </div>
                  <div className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-3.5 text-mist" />
                    {course.sessionsCount} sesiones
                  </div>
                  <div className="inline-flex items-center gap-1.5">
                    <Sprout className="size-3.5 text-mist" />
                    {course.weeks} semanas
                  </div>
                </dl>

                <p className="mt-3 text-xs font-medium text-seed-700">
                  Gratuito · Certificado desde {formatSoles(3000)}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* ═══ 6 · SILP ════════════════════════════════════════ */}
      <Section tone="muted" className="py-14 sm:py-16">
        <Container size="wide">
          <div className="overflow-hidden rounded-[18px] border border-line bg-white">
            <div className="grid items-center gap-8 p-8 sm:p-10 lg:grid-cols-[1.7fr_1fr]">
              <div>
                <Badge tone="gold">
                  <Sparkles className="size-3.5" />
                  Programa insignia
                </Badge>
                <h2 className="mt-4 font-display text-[1.75rem] font-semibold leading-tight text-ink sm:text-[2rem]">
                  {silp.title}
                </h2>
                <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-slate-ui">
                  {silp.description}
                </p>
                <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-graphite">
                  <li className="inline-flex items-center gap-1.5">
                    <Check className="size-4 text-seed-500" /> 6 semanas
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <Check className="size-4 text-seed-500" /> Proyecto de impacto real
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <Check className="size-4 text-seed-500" /> Mentoría 1:1
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <Check className="size-4 text-seed-500" /> Certificado incluido
                  </li>
                </ul>
              </div>

              <div className="rounded-[14px] border border-line bg-surface-1 p-6 text-center">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-ui">
                  Tarifa social
                </p>
                <p className="tabular mt-1.5 font-display text-[2.5rem] font-bold leading-none sep-gradient-text">
                  {formatSoles(silp.priceCents ?? 20000)}
                </p>
                <p className="mt-1.5 text-xs text-slate-ui">
                  Gratis para voluntarios activos
                </p>
                <Button href="/silp" variant="gradient" className="mt-5 w-full">
                  Ver el programa
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══ 7 · CÓMO FUNCIONA ═══════════════════════════════ */}
      <Section>
        <Container size="wide">
          <SectionHeader
            eyebrow="Cómo funciona"
            title="De la inscripción al certificado en 2 semanas"
            align="center"
          />

          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Users,
                title: "Crea tu cuenta gratis",
                body: "Sin costo, sin filtros. Solo necesitas tu correo y tu región.",
              },
              {
                icon: GraduationCap,
                title: "Elige tu curso",
                body: "Design Thinking, Scrum social o liderazgo. Todos abiertos.",
              },
              {
                icon: CalendarDays,
                title: "6 sesiones en vivo",
                body: "2 horas cada una, interdiario, con facilitadores de SEP.",
              },
              {
                icon: Award,
                title: "Obtén tu certificado",
                body: "Opcional: SEP por S/30 o internacional por S/50.",
              },
            ].map((step, i) => (
              <li key={step.title} className="relative">
                <div className="flex size-11 items-center justify-center rounded-[12px] bg-sep-50 text-sep-600">
                  <step.icon className="size-5" />
                </div>
                <p className="tabular mt-4 text-xs font-semibold tracking-[0.14em] text-gold-600">
                  PASO {i + 1}
                </p>
                <h3 className="mt-1.5 font-display text-lg font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-ui">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ═══ 8 · CERTIFICADOS ════════════════════════════════ */}
      <Section tone="muted" id="certificados">
        <Container size="wide">
          <SectionHeader
            eyebrow="Certificación"
            title="Aprender es gratis. Acreditarlo, opcional."
            description="Al completar las 6 sesiones puedes obtener tu certificado. Es la forma en que SEP se sostiene sin cobrar por la formación."
            align="center"
          />

          <div className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-2">
            {certificateTypes.map((cert) => (
              <Card
                key={cert.slug}
                className={
                  cert.recommended
                    ? "relative border-sep-200 shadow-[0_8px_32px_rgba(46,11,232,.09)]"
                    : ""
                }
              >
                {cert.recommended && (
                  <span className="absolute -top-3 left-6 rounded-full bg-gold-500 px-3 py-1 text-[0.6875rem] font-semibold text-ink">
                    Recomendado
                  </span>
                )}

                <h3 className="font-display text-lg font-semibold text-ink">
                  {cert.name}
                </h3>
                <p className="mt-1 text-xs text-slate-ui">{cert.issuer}</p>

                <p className="tabular mt-5 font-display text-[2.25rem] font-bold leading-none text-ink">
                  {formatSoles(cert.priceCents)}
                </p>

                <ul className="mt-5 space-y-2.5">
                  {cert.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-graphite">
                      <Check className="mt-0.5 size-4 shrink-0 text-seed-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>

          <p className="mx-auto mt-8 max-w-xl text-center text-sm text-slate-ui">
            ¿Quieres el detalle completo de precios, membresías y programas
            institucionales?{" "}
            <Link href="/precios" className="font-medium text-sep-600 hover:underline">
              Ver todos los precios
            </Link>
          </p>
        </Container>
      </Section>

      {/* ═══ 9 · DOCENTES + 10 · COLEGIOS ════════════════════ */}
      <Section>
        <Container size="wide">
          <div className="grid gap-5 lg:grid-cols-2">
            {/* Docentes */}
            <div className="flex flex-col rounded-[18px] border border-line bg-white p-8">
              <div className="flex size-11 items-center justify-center rounded-[12px] bg-gold-500/15 text-gold-700">
                <GraduationCap className="size-5" />
              </div>
              <h2 className="mt-5 font-display text-[1.6rem] font-semibold leading-tight text-ink">
                ¿Enseñas? Lleva metodologías activas a tu aula
              </h2>
              <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-slate-ui">
                Programa gratuito para docentes de colegios, institutos y universidades.
                Design Thinking y Scrum aplicados al entorno escolar, con guías y
                plantillas listas para usar el lunes siguiente.
              </p>
              <div className="mt-6">
                <Button href="/docentes" variant="outline">
                  Conocer el programa docente
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>

            {/* Colegios */}
            <div className="flex flex-col rounded-[18px] border border-line bg-white p-8">
              <div className="flex size-11 items-center justify-center rounded-[12px] bg-seed-500/15 text-seed-700">
                <School className="size-5" />
              </div>
              <h2 className="mt-5 font-display text-[1.6rem] font-semibold leading-tight text-ink">
                Inscribe tu colegio a la red SEP
              </h2>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-slate-ui">
                Universitarios de tu propia región dictan talleres de innovación social a
                tus estudiantes. <strong className="text-ink">Completamente gratuito.</strong>
              </p>

              <ul className="mt-5 flex-1 space-y-2">
                {schoolBenefits.slice(0, 3).map((b) => (
                  <li key={b.title} className="flex items-start gap-2.5 text-sm text-graphite">
                    <Check className="mt-0.5 size-4 shrink-0 text-seed-500" />
                    {b.title}
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <Button href="/colegios" variant="outline">
                  Inscribir mi colegio
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══ 11 · VOLUNTARIADO ═══════════════════════════════ */}
      <Section tone="muted" id="voluntariado">
        <Container size="wide">
          <SectionHeader
            eyebrow="Voluntariado"
            title="Forma parte del equipo que democratiza la innovación"
            description="Tres roles abiertos. Todos incluyen certificación formal, carta de recomendación y acceso gratuito a todos los cursos SEP."
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {volunteerRoles.map((role) => (
              <Card key={role.slug} interactive className="flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex size-10 items-center justify-center rounded-[10px] bg-sep-50 text-sep-600">
                    {role.type === "mentor_junior" ? (
                      <Users className="size-5" />
                    ) : role.type === "community_manager" ? (
                      <MessageCircle className="size-5" />
                    ) : (
                      <CalendarDays className="size-5" />
                    )}
                  </div>
                  <Badge tone="gold">
                    {role.openPositions}{" "}
                    {role.openPositions === 1 ? "vacante" : "vacantes"}
                  </Badge>
                </div>

                <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                  {role.name}
                </h3>
                {role.exclusive && (
                  <p className="mt-1 text-xs font-medium text-gold-700">{role.exclusive}</p>
                )}
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-ui">
                  {role.description}
                </p>

                <p className="mt-4 text-xs text-slate-ui">
                  <Clock className="mr-1.5 inline size-3.5 text-mist" />
                  {role.hoursPerWeek} h por semana
                </p>

                <Button
                  href={`/voluntariado/${role.slug}`}
                  variant="outline"
                  size="sm"
                  className="mt-5 w-full"
                >
                  Postular
                </Button>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* ═══ 12 · TESTIMONIOS ════════════════════════════════ */}
      <Section>
        <Container size="wide">
          <SectionHeader
            eyebrow="La comunidad"
            title="75+ jóvenes ya están construyendo desde sus regiones"
            align="center"
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {[
              {
                quote:
                  "Compartí mi prototipo de Design Thinking con mi colegio esta semana. Los escolares llegaron con ideas increíbles para mejorar la biblioteca del barrio.",
                name: "Andrea N.",
                region: "Arequipa",
                role: "Mentora SEP",
              },
              {
                quote:
                  "Vengo de una región sin recursos y la innovación social fue mi trampolín. Hoy hablo en conferencias de todo Latam.",
                name: "Valeria R.",
                region: "Bogotá, Colombia",
                role: "Speaker · Scrum",
              },
              {
                quote:
                  "Llegué sin experiencia. Hoy tengo mi propio programa y fui speaker en Star Lima.",
                name: "Jorge M.",
                region: "Arequipa",
                role: "Liderazgo social",
              },
            ].map((t) => (
              <Card key={t.name} className="flex flex-col">
                <p className="flex-1 text-[0.9375rem] leading-relaxed text-graphite">
                  “{t.quote}”
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full sep-gradient text-xs font-semibold text-white">
                    {t.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">{t.name}</p>
                    <p className="text-xs text-slate-ui">
                      {t.region} · {t.role}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* ═══ 13 · ALIADOS ════════════════════════════════════ */}
      <section className="border-y border-line bg-surface-1 py-12">
        <Container size="wide">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-ui">
            Respaldo, alianzas y redes
          </p>
        </Container>

        <div className="relative mt-7 overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-surface-1 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-surface-1 to-transparent"
          />

          <ul className="flex w-max animate-marquee gap-10">
            {[...partners, ...partners].map((p, i) => (
              <li
                key={`${p.name}-${i}`}
                className="whitespace-nowrap font-display text-[1.0625rem] font-semibold text-mist transition-colors hover:text-graphite"
              >
                {p.name}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══ 14 · EMPRESAS / RSE ═════════════════════════════ */}
      <Section id="empresas">
        <Container size="wide">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <Badge tone="brand">
                <Building2 className="size-3.5" />
                Para empresas y organizaciones
              </Badge>
              <h2 className="mt-5 font-display text-[2rem] font-semibold leading-tight text-ink sm:text-[2.5rem]">
                Convierte tu inversión social en{" "}
                <GoldUnderline>resultados medibles</GoldUnderline>
              </h2>
              <p className="mt-5 text-[1.0625rem] leading-relaxed text-slate-ui">
                Somos el aliado que ejecuta en regiones donde tu empresa quiere estar y
                te entrega las métricas que tu directorio necesita ver.
              </p>

              <div className="mt-8">
                <Button href="/empresas" variant="gradient" size="lg">
                  Hablar con el equipo
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: Globe,
                  title: "Alcance regional real",
                  body: "10+ regiones fuera de Lima, con presencia validada en Áncash.",
                },
                {
                  icon: Lightbulb,
                  title: "Métricas claras",
                  body: "Jóvenes formados, proyectos, horas y colegios impactados.",
                },
                {
                  icon: Handshake,
                  title: "Alineación con ODS",
                  body: "Reporte trimestral mapeado a los Objetivos de Desarrollo Sostenible.",
                },
                {
                  icon: Users,
                  title: "Pipeline de talento",
                  body: "Acceso a jóvenes formados en liderazgo y metodologías ágiles.",
                },
              ].map((f) => (
                <Card key={f.title} className="p-5">
                  <f.icon className="size-5 text-sep-600" />
                  <h3 className="mt-3.5 text-[0.9375rem] font-semibold text-ink">
                    {f.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-ui">{f.body}</p>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══ 15 · DIAGNÓSTICO + 16 · SPEAKERS ════════════════ */}
      <Section tone="muted">
        <Container size="wide">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-[18px] border border-line bg-white p-8">
              <Badge tone="seed">3 minutos · sin crear cuenta</Badge>
              <h2 className="mt-4 font-display text-[1.6rem] font-semibold leading-tight text-ink">
                Estamos construyendo esto para ti. Ayúdanos a hacerlo bien.
              </h2>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-slate-ui">
                Antes de abrir las puertas queremos entender tu realidad: qué te frena, qué
                sueñas y qué necesitas. Tus respuestas definen qué construimos primero.
              </p>
              <Button href="/conocenos" variant="primary" className="mt-6">
                Quiero participar — es gratis
                <ArrowRight className="size-4" />
              </Button>
            </div>

            <div className="rounded-[18px] border border-line bg-white p-8">
              <div className="flex size-11 items-center justify-center rounded-[12px] bg-sep-50 text-sep-600">
                <Mic className="size-5" />
              </div>
              <h2 className="mt-5 font-display text-[1.6rem] font-semibold leading-tight text-ink">
                ¿Tienes algo que contar?
              </h2>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-slate-ui">
                Únete a nuestra base de 48 speakers e inspira a más de 1,000 jóvenes desde
                tu región y tu historia. Especialistas en metodologías, referentes de
                impacto y voces de toda Latinoamérica.
              </p>
              <Button href="/speakers" variant="outline" className="mt-6">
                Unirme a la red de speakers
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══ 17 · NEWSLETTER ═════════════════════════════════ */}
      <Section>
        <Container size="narrow">
          <div className="text-center">
            <SectionHeader
              eyebrow="Newsletter SEP"
              title="No importa tu región"
              description="Recibe las últimas oportunidades, eventos y recursos directamente en tu inbox. Sé el primero en enterarte de nuevas cohortes, becas, ferias y llamados a voluntarios."
              align="center"
            />
            <div className="mx-auto mt-8 max-w-lg">
              <NewsletterForm />
            </div>
            <p className="mt-6 text-xs text-mist">
              1,200+ suscriptores · 2 ediciones al mes · 48 h antes del anuncio público
            </p>
          </div>
        </Container>
      </Section>

      {/* ═══ 18 · FAQ ════════════════════════════════════════ */}
      <Section tone="muted" id="faq">
        <Container size="narrow">
          <SectionHeader
            eyebrow="Preguntas frecuentes"
            title="Lo que suelen preguntarnos"
            align="center"
          />
          <div className="mt-10">
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </Section>

      {/* ═══ 19 · CTA FINAL ══════════════════════════════════ */}
      <section className="relative overflow-hidden sep-gradient">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />
        <Container size="wide" className="relative py-20 text-center sm:py-24">
          <Sprout className="mx-auto size-9 text-gold-500" />
          <h2 className="mx-auto mt-6 max-w-2xl font-display text-[2.25rem] font-bold leading-tight text-white sm:text-[3rem]">
            ¿Listos para sembrar el cambio?
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-lg text-white/75">
            Crea tu cuenta gratis y empieza tu primer curso esta semana. Sin importar tu
            región, tu carrera o tu punto de partida.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/registro" variant="gold" size="lg">
              Crear cuenta gratis
              <ArrowRight className="size-4" />
            </Button>
            <Button
              href={siteConfig.contact.whatsappUrl}
              variant="outline-white"
              size="lg"
            >
              <MessageCircle className="size-4" />
              Escríbenos por WhatsApp
            </Button>
          </div>
        </Container>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: siteConfig.name,
            alternateName: siteConfig.shortName,
            url: siteConfig.url,
            email: siteConfig.contact.email,
            telephone: siteConfig.contact.whatsapp,
            foundingDate: siteConfig.founded,
            description: siteConfig.description,
            address: {
              "@type": "PostalAddress",
              addressRegion: "Áncash",
              addressCountry: "PE",
            },
            sameAs: Object.values(siteConfig.social),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
    </>
  );
}
