import type { Metadata } from "next";
import Link from "next/link";
import {
  Award,
  BookOpen,
  ChartPie,
  CreditCard,
  Inbox,
  School,
  ShieldCheck,
  Users,
} from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import { Badge, Card } from "@/components/ui/primitives";
import { formatSoles } from "@/lib/utils";

export const metadata: Metadata = { title: "Administración" };

async function count(
  supabase: Awaited<ReturnType<typeof createClient>>,
  table: string,
  filter?: (q: never) => never,
) {
  void filter;
  const { count: n } = await supabase
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .from(table as any)
    .select("*", { count: "exact", head: true });
  return n ?? 0;
}

export default async function AdminPage() {
  const user = await requireRole(["admin", "super_admin"]);
  const supabase = await createClient();

  const [users, enrollments, certificates, applications, schools, leads] =
    await Promise.all([
      count(supabase, "profiles"),
      count(supabase, "enrollments"),
      count(supabase, "certificates"),
      count(supabase, "volunteer_applications"),
      count(supabase, "school_applications"),
      count(supabase, "survey_leads"),
    ]);

  const { data: paidOrders } = await supabase
    .from("orders")
    .select("amount_cents")
    .eq("status", "pagado");

  const revenue = (paidOrders ?? []).reduce((s, o) => s + o.amount_cents, 0);

  const shortcuts = [
    { href: "/admin/usuarios", label: "Usuarios y roles", icon: Users, detail: `${users} registrados` },
    { href: "/admin/cursos", label: "Cursos y sesiones", icon: BookOpen, detail: "Editar el catálogo" },
    { href: "/admin/certificados", label: "Emitir certificados", icon: Award, detail: `${certificates} emitidos` },
    { href: "/admin/pagos", label: "Conciliar pagos", icon: CreditCard, detail: "Yape, Plin y Culqi" },
    { href: "/admin/postulaciones", label: "Postulaciones", icon: Inbox, detail: `${applications} recibidas` },
    { href: "/admin/colegios", label: "Red de colegios", icon: School, detail: `${schools} solicitudes` },
    { href: "/admin/diagnostico", label: "Diagnóstico", icon: ChartPie, detail: `${leads} respuestas` },
    { href: "/admin/auditoria", label: "Auditoría", icon: ShieldCheck, detail: "Solo super admin" },
  ];

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

      <section className="mt-8">
        <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
          Accesos rápidos
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {shortcuts.map((s) => (
            <Card
              key={s.href}
              interactive
              className="p-5"
              as={Link}
              {...{ href: s.href }}
            >
              <s.icon className="size-5 text-sep-600" />
              <h3 className="mt-3.5 text-[0.9375rem] font-medium text-ink">{s.label}</h3>
              <p className="mt-1 text-xs text-slate-ui">{s.detail}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <Card className="border-warning/25 bg-warning-bg/60">
          <div className="flex items-start gap-3.5">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#8A5A00]" />
            <div>
              <h2 className="font-display text-[0.9375rem] font-semibold text-ink">
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
