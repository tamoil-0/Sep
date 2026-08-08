import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Clock } from "lucide-react";
import { Badge, Card, Container, Section } from "@/components/ui/primitives";
import { volunteerProcess, volunteerRoles } from "@/config/volunteering";
import { VolunteerForm } from "./volunteer-form";

export function generateStaticParams() {
  return volunteerRoles.map((r) => ({ rol: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ rol: string }>;
}): Promise<Metadata> {
  const { rol } = await params;
  const role = volunteerRoles.find((r) => r.slug === rol);
  if (!role) return { title: "Rol no encontrado" };

  return {
    title: `Postular como ${role.name}`,
    description: role.description,
  };
}

export default async function PostularPage({
  params,
}: {
  params: Promise<{ rol: string }>;
}) {
  const { rol } = await params;
  const role = volunteerRoles.find((r) => r.slug === rol);
  if (!role) notFound();

  return (
    <Section>
      <Container size="wide">
        <Link
          href="/voluntariado"
          className="inline-flex items-center gap-1.5 text-sm text-slate-ui transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" />
          Todos los roles
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Info del rol */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="gold">
                {role.openPositions}{" "}
                {role.openPositions === 1 ? "vacante abierta" : "vacantes abiertas"}
              </Badge>
              {role.exclusive && <Badge tone="brand">{role.exclusive}</Badge>}
            </div>

            <h1 className="mt-4 font-display text-[2.25rem] font-bold leading-tight text-ink">
              {role.name}
            </h1>
            <p className="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-slate-ui">
              {role.description}
            </p>

            <p className="mt-5 inline-flex items-center gap-2 text-sm text-graphite">
              <Clock className="size-4 text-mist" />
              {role.hoursPerWeek} horas por semana
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <Card className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-ui">
                  Requisitos
                </p>
                <ul className="mt-3.5 space-y-2.5">
                  {role.requirements.map((r) => (
                    <li key={r} className="flex items-start gap-2.5 text-sm text-graphite">
                      <Check className="mt-0.5 size-4 shrink-0 text-seed-500" />
                      {r}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-ui">
                  Proceso
                </p>
                <ol className="mt-3.5 space-y-3">
                  {volunteerProcess.map((s) => (
                    <li key={s.step} className="flex gap-2.5">
                      <span className="tabular flex size-5 shrink-0 items-center justify-center rounded-full bg-sep-50 text-[0.625rem] font-semibold text-sep-600">
                        {s.step}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-ink">{s.title}</p>
                        <p className="text-xs text-slate-ui">{s.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Card>
            </div>

            <Card className="mt-5 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-ui">
                Lo que ganas
              </p>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {role.benefits.map((b) => (
                  <li key={b.title}>
                    <p className="text-sm font-medium text-ink">{b.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-ui">
                      {b.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Formulario */}
          <Card className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="font-display text-[1.25rem] font-semibold text-ink">
              Formulario de postulación
            </h2>
            <p className="mt-1 text-sm text-slate-ui">
              Rol: {role.name} · Respondemos en 48 h
            </p>

            <div className="mt-6">
              <VolunteerForm roleSlug={role.slug} roleName={role.name} />
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
