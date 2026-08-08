import type { Metadata } from "next";
import Link from "next/link";
import {
  Award,
  Check,
  Download,
  ExternalLink,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { getMyCertificates, getCertificateTypes } from "@/server/queries/payments";
import { getMyEnrollments } from "@/server/queries/courses";
import { PageHeader } from "@/components/app/page-header";
import { Badge, Card, EmptyState, ProgressBar } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/app/copy-button";
import { formatDate, formatSoles } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { RequestCertificateButtons } from "./request-buttons";

export const metadata: Metadata = { title: "Mis certificados" };

export default async function CertificadosPage() {
  const user = await requireUser();

  const [certificates, types, enrollments] = await Promise.all([
    getMyCertificates(user.id),
    getCertificateTypes(),
    getMyEnrollments(user.id),
  ]);

  const issued = certificates.filter((c) => c.status === "emitido" && !c.revoked_at);
  const pending = certificates.filter((c) => c.status === "pendiente");
  const completed = enrollments.filter((e) => e.status === "completado");
  const inProgress = enrollments.filter((e) => e.status === "activo");

  return (
    <>
      <PageHeader
        title="Mis certificados"
        description="El curso siempre es gratis. El certificado es opcional y acredita lo que aprendiste."
      />

      {/* ── Emitidos ── */}
      {issued.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
            Obtenidos
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {issued.map((c) => (
              <Card key={c.id} className="overflow-hidden p-0">
                <div className="sep-gradient px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-display text-[0.9375rem] font-semibold text-white">
                        {c.type?.name}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-white/65">
                        {c.type?.issuer}
                      </p>
                    </div>
                    <Award className="size-5 shrink-0 text-gold-500" />
                  </div>
                </div>

                <div className="p-5">
                  {c.courseTitle && (
                    <p className="text-sm font-medium text-ink">{c.courseTitle}</p>
                  )}
                  <p className="mt-0.5 text-xs text-slate-ui">
                    Emitido el {c.issued_at ? formatDate(c.issued_at) : "—"}
                  </p>

                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-surface-1 px-3 py-2">
                    <ShieldCheck className="size-4 shrink-0 text-seed-500" />
                    <code className="tabular flex-1 truncate text-xs font-medium text-ink">
                      {c.verification_code}
                    </code>
                    <CopyButton
                      value={`${siteConfig.url}/verificar/${c.verification_code}`}
                      label="Copiar enlace de verificación"
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      href={`/api/certificados/${c.id}/pdf`}
                      variant="primary"
                      size="sm"
                    >
                      <Download className="size-4" />
                      Descargar PDF
                    </Button>
                    <Button
                      href={`/verificar/${c.verification_code}`}
                      variant="outline"
                      size="sm"
                    >
                      <ExternalLink className="size-4" />
                      Ver verificación
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* ── Cursos completados sin certificado ── */}
      {completed.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
            Listos para certificar
          </h2>
          <div className="space-y-3">
            {completed.map((e) => {
              const already = issued.filter((c) => c.courseSlug === e.course?.slug);
              const isPending = pending.length > 0;

              return (
                <Card key={e.id}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge tone="success">
                          <Check className="size-3.5" />
                          Completado
                        </Badge>
                        {e.completed_at && (
                          <span className="text-xs text-slate-ui">
                            {formatDate(e.completed_at)}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-2.5 font-display text-[1.0625rem] font-semibold text-ink">
                        {e.course?.title}
                      </h3>
                      <p className="mt-0.5 text-sm text-slate-ui">
                        {e.course?.sessions_count} sesiones · {e.course?.total_hours} horas
                      </p>
                    </div>
                  </div>

                  {isPending && (
                    <div className="mt-4 rounded-[10px] border border-warning/30 bg-warning-bg px-4 py-3">
                      <p className="text-sm text-graphite">
                        Tienes un certificado en proceso de pago.{" "}
                        <Link
                          href="/estudiante/certificados"
                          className="font-medium text-[#8A5A00] hover:underline"
                        >
                          Revisa su estado
                        </Link>
                        .
                      </p>
                    </div>
                  )}

                  <div className="mt-5 border-t border-line pt-5">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-slate-ui">
                      Elige tu certificado
                    </p>
                    <RequestCertificateButtons
                      enrollmentId={e.id}
                      types={types.map((t) => ({
                        id: t.id,
                        name: t.name,
                        issuer: t.issuer,
                        priceCents: t.price_cents,
                        kind: t.kind,
                        owned: already.some((c) => c.type?.kind === t.kind),
                      }))}
                    />
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* ── En progreso ── */}
      {inProgress.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
            En camino
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {inProgress.map((e) => (
              <Card key={e.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-display text-[0.9375rem] font-semibold text-ink">
                      {e.course?.title}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-ui">
                      <Lock className="size-3.5" />
                      Completa las {e.course?.sessions_count} sesiones para desbloquearlo
                    </p>
                  </div>
                  <span className="tabular shrink-0 text-sm font-semibold text-sep-600">
                    {e.progress_pct}%
                  </span>
                </div>
                <ProgressBar value={e.progress_pct} className="mt-4" />
                <Button
                  href={`/estudiante/curso/${e.course?.slug}`}
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full"
                >
                  Continuar el curso
                </Button>
              </Card>
            ))}
          </div>
        </section>
      )}

      {certificates.length === 0 && enrollments.length === 0 && (
        <EmptyState
          icon={<Award className="size-5" />}
          title="Aún no tienes certificados"
          description="Inscríbete a un curso gratuito, completa las 6 sesiones y podrás obtener tu certificado."
          action={<Button href="/estudiante/catalogo">Explorar cursos</Button>}
        />
      )}

      {/* ── Tipos de certificado ── */}
      <section className="mt-10">
        <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
          Tipos de certificado
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {types.map((t) => (
            <Card key={t.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-[0.9375rem] font-semibold text-ink">
                      {t.name}
                    </h3>
                    {t.kind === "internacional" && <Badge tone="gold">Recomendado</Badge>}
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-ui">
                    {t.description}
                  </p>
                </div>
                <p className="tabular shrink-0 font-display text-lg font-semibold text-ink">
                  {formatSoles(t.price_cents)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
