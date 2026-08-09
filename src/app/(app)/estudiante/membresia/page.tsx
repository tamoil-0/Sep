import type { Metadata } from "next";
import { Check, Sprout } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { getActiveMembership, getMembershipPlans } from "@/server/queries/payments";
import { PageHeader } from "@/components/app/page-header";
import { Badge, Card } from "@/components/ui/primitives";
import { PanelSection } from "@/components/app/data-views";
import { formatDate, formatSoles } from "@/lib/utils";

export const metadata: Metadata = { title: "Mi membresía" };

export default async function MembresiaPage() {
  const user = await requireRole(["estudiante", "mentor", "admin", "super_admin"]);
  const [membership, plans] = await Promise.all([
    getActiveMembership(user.id),
    getMembershipPlans(),
  ]);

  const currentSlug = membership?.plan?.slug ?? "semilla";

  return (
    <>
      <PageHeader
        title="Mi membresía"
        description="Los cursos son gratis siempre. La membresía añade certificados incluidos y mentoría."
      />

      <Card className="overflow-hidden p-0">
        <div className="sep-gradient px-7 py-6 text-white">
          <p className="text-xs uppercase tracking-[0.12em] text-white/70">Tu plan actual</p>
          <h2 className="mt-2 font-display text-[1.75rem] font-semibold">
            {membership?.plan?.name ?? "Semilla"}
          </h2>
          <p className="mt-1 text-sm text-white/75">
            {membership
              ? `Vigente hasta el ${formatDate(membership.ends_at)}`
              : "Gratuito, para siempre"}
          </p>
        </div>
      </Card>

      <PanelSection title="Planes disponibles">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((p) => {
            const isCurrent = p.slug === currentSlug;
            const benefits = Array.isArray(p.benefits) ? (p.benefits as string[]) : [];
            return (
              <Card
                key={p.id}
                className={isCurrent ? "flex flex-col border-sep-300 bg-sep-50/40" : "flex flex-col"}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-[1.0625rem] font-semibold text-ink">{p.name}</h3>
                  {isCurrent && <Badge tone="brand">Actual</Badge>}
                </div>

                <p className="tabular mt-4 font-display text-[1.75rem] font-bold leading-none text-ink">
                  {p.price_cents === 0 ? "Gratis" : formatSoles(p.price_cents)}
                </p>
                <p className="mt-1 text-xs text-slate-ui">
                  {p.duration_months === 0 ? "Para siempre" : `${p.duration_months} meses`}
                </p>

                <ul className="mt-5 flex-1 space-y-2 border-t border-line pt-4">
                  {benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-graphite">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-seed-500" />
                      {b}
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      </PanelSection>

      <Card className="mt-8 border-gold-500/35 bg-[#FFFBF0]">
        <div className="flex items-start gap-3.5">
          <Sprout className="mt-0.5 size-5 shrink-0 text-gold-700" />
          <div>
            <h3 className="font-display text-[1.0625rem] font-semibold text-ink">
              Los voluntarios tienen todo gratis
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-graphite">
              Si eres mentor, community manager u organizador activo, accedes a todos los
              beneficios sin pagar nada, por tu servicio a SEP.
            </p>
          </div>
        </div>
      </Card>
    </>
  );
}
