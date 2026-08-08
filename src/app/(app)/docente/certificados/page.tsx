import type { Metadata } from "next";
import { Award, Download, ShieldCheck } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { getMyCertificates } from "@/server/queries/payments";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import { Card, EmptyState } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/app/copy-button";
import { PanelSection } from "@/components/app/data-views";
import { formatDate } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Mis certificados" };

export default async function DocenteCertificadosPage() {
  const user = await requireRole(["docente", "admin", "super_admin"]);
  const certs = await getMyCertificates(user.id);
  const issued = certs.filter((c) => c.status === "emitido" && !c.revoked_at);

  return (
    <>
      <PageHeader
        title="Mis certificados"
        description="Sirven para tu legajo y tu escala magisterial. Cada uno lleva código público de verificación."
      />

      <KpiGrid>
        <Kpi label="Emitidos" value={issued.length} icon={<Award className="size-4" />} />
        <Kpi label="En proceso" value={certs.filter((c) => c.status === "pendiente").length} />
        <Kpi label="Total" value={certs.length} />
        <Kpi label="Verificables" value={issued.length} icon={<ShieldCheck className="size-4" />} />
      </KpiGrid>

      <PanelSection title="Obtenidos">
        {issued.length === 0 ? (
          <EmptyState
            icon={<Award className="size-5" />}
            title="Todavía no tienes certificados"
            description="Completa el programa docente y podrás obtener el tuyo desde S/30."
            action={<Button href="/docente/programa">Ver mi programa</Button>}
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {issued.map((c) => (
              <Card key={c.id} className="overflow-hidden p-0">
                <div className="sep-gradient px-5 py-4">
                  <p className="font-display text-[0.9375rem] font-semibold text-white">{c.type?.name}</p>
                  <p className="mt-0.5 text-xs text-white/65">{c.type?.issuer}</p>
                </div>
                <div className="p-5">
                  {c.courseTitle && <p className="text-sm font-medium text-ink">{c.courseTitle}</p>}
                  <p className="mt-0.5 text-xs text-slate-ui">
                    Emitido el {c.issued_at ? formatDate(c.issued_at) : "—"}
                  </p>
                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-surface-1 px-3 py-2">
                    <ShieldCheck className="size-4 shrink-0 text-seed-500" />
                    <code className="tabular flex-1 truncate text-xs font-medium text-ink">
                      {c.verification_code}
                    </code>
                    <CopyButton value={`${siteConfig.url}/verificar/${c.verification_code}`} label="Copiar enlace" />
                  </div>
                  <Button href={`/api/certificados/${c.id}/pdf`} variant="primary" size="sm" className="mt-4 w-full">
                    <Download className="size-4" />
                    Descargar PDF
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </PanelSection>
    </>
  );
}

