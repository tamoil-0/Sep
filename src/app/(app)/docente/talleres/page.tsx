import type { Metadata } from "next";
import { CalendarPlus } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/page-header";
import { Card, EmptyState } from "@/components/ui/primitives";
import { StatusBadge, PanelSection } from "@/components/app/data-views";
import { WorkshopRequestForm } from "./request-form";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Solicitar taller" };

export default async function DocenteTalleresPage() {
  const user = await requireRole(["docente", "admin", "super_admin"]);
  const supabase = await createClient();

  const [{ data: profile }, { data: mine }] = await Promise.all([
    supabase.from("profiles").select("institution_id, institutions(name)").eq("id", user.id).maybeSingle(),
    supabase
      .from("workshops")
      .select("id, title, topic, scheduled_at, status, students_count, grade")
      .eq("requested_by", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const inst = Array.isArray(profile?.institutions) ? profile?.institutions[0] : profile?.institutions;

  return (
    <>
      <PageHeader
        title="Solicitar un taller"
        description="Universitarios formados por SEP van a tu aula. Sin costo para el colegio."
      />

      <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
        <Card className="lg:sticky lg:top-6 lg:self-start">
          <h2 className="font-display text-[1.125rem] font-semibold text-ink">Nueva solicitud</h2>
          <p className="mt-1.5 text-sm text-slate-ui">
            {inst?.name ? `Para ${inst.name}` : "Primero vincula tu colegio en Mi colegio."}
          </p>
          <div className="mt-6">
            <WorkshopRequestForm
              institutionId={profile?.institution_id ?? null}
              institutionName={inst?.name ?? null}
            />
          </div>
        </Card>

        <div>
          <PanelSection title="Mis solicitudes" className="mt-0">
            {(mine?.length ?? 0) === 0 ? (
              <EmptyState
                icon={<CalendarPlus className="size-5" />}
                title="Aún no solicitaste ningún taller"
                description="Completa el formulario y te contactamos en menos de 72 horas."
              />
            ) : (
              <Card className="p-0">
                <ul className="divide-y divide-line">
                  {(mine ?? []).map((w) => (
                    <li key={w.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">{w.title}</p>
                        <p className="mt-0.5 text-xs text-slate-ui">
                          {w.grade ?? "—"}
                          {w.students_count ? ` · ${w.students_count} estudiantes` : ""}
                          {w.scheduled_at ? ` · ${formatDate(w.scheduled_at)}` : ""}
                        </p>
                      </div>
                      <StatusBadge status={w.status} />
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </PanelSection>
        </div>
      </div>
    </>
  );
}

