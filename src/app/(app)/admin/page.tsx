import type { Metadata } from "next";
import {
  Award,
  BookOpen,
  CreditCard,
  ShieldCheck,
  Users,
} from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import { Badge, Card } from "@/components/ui/primitives";
import { formatSoles } from "@/lib/utils";
import { assertQueryResults } from "@/lib/supabase/query";

export const metadata: Metadata = { title: "Administración" };

async function count(
  supabase: Awaited<ReturnType<typeof createClient>>,
  table: string,
  filter?: (q: never) => never,
) {
  void filter;
  const result = await supabase
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .from(table as any)
    .select("*", { count: "exact", head: true });
  assertQueryResults(`admin:contador:${table}`, result);
  return result.count ?? 0;
}

export default async function AdminPage() {
  const user = await requireRole(["admin", "super_admin"]);
  const supabase = await createClient();

  const [users, enrollments, certificates] =
    await Promise.all([
      count(supabase, "profiles"),
      count(supabase, "enrollments"),
      count(supabase, "certificates"),
    ]);

  const paidOrdersResult = await supabase
    .from("orders")
    .select("amount_cents")
    .eq("status", "pagado");
  assertQueryResults("admin:ingresos", paidOrdersResult);
  const paidOrders = paidOrdersResult.data;

  const revenue = (paidOrders ?? []).reduce((s, o) => s + o.amount_cents, 0);

  return (
    <>
      <PageHeader
        title="Panel de administración"
        description="Estado general de la plataforma SEP."
        action={
          <Badge tone={user.roles.includes("super_admin") ? "brand" : "neutral"}>
            {user.roles.includes("super_admin") ? "Super administrador" : "Administrador"}
          </Badge>
        }
      />

      <KpiGrid>
        <Kpi label="Usuarios registrados" value={users} icon={<Users className="size-4" />} />
        <Kpi label="Inscripciones" value={enrollments} icon={<BookOpen className="size-4" />} />
        <Kpi label="Certificados" value={certificates} icon={<Award className="size-4" />} />
        <Kpi
          label="Ingresos confirmados"
          value={formatSoles(revenue)}
          hint="Órdenes en estado pagado"
          icon={<CreditCard className="size-4" />}
        />
      </KpiGrid>

      <section className="mt-6 sm:mt-8">
        <Card className="border-warning/25 bg-warning-bg/60">
          <div className="flex items-start gap-3.5">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#8A5A00]" />
            <div>
              <h2 className="font-display text-body-sm font-semibold text-ink">
                Recordatorio de seguridad
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-graphite">
                El acceso a esta sección requiere MFA activo. Toda asignación o revocación
                de roles queda registrada en el log de auditoría con tu identidad, IP y
                marca de tiempo.
              </p>
            </div>
          </div>
        </Card>
      </section>
    </>
  );
}
