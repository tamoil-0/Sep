import type { Metadata } from "next";
import { GraduationCap, Presentation, School } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import {
  DataTable,
  EmptyState,
  PanelSection,
} from "@/components/app/data-views";
import { formatDate } from "@/lib/utils";
import { SchoolQueue } from "./school-queue";

export const metadata: Metadata = { title: "Red de colegios" };

export default async function AdminColegiosPage() {
  await requireRole(["admin", "super_admin"]);
  const supabase = await createClient();

  const [{ data: apps }, { data: impact }] = await Promise.all([
    supabase
      .from("school_applications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase.from("school_impact").select("*"),
  ]);

  const pending = (apps ?? []).filter(
    (a) => a.status === "recibida" || a.status === "en_revision",
  );
  const students = (impact ?? []).reduce(
    (s, i) => s + Number(i.students_reached ?? 0),
    0,
  );
  const workshops = (impact ?? []).reduce(
    (s, i) => s + Number(i.workshops_done ?? 0),
    0,
  );

  return (
    <>
      <PageHeader
        title="Red de colegios"
        description="Aprobar una solicitud crea la institución en la red y la deja lista para recibir talleres."
      />

      <KpiGrid>
        <Kpi
          label="Colegios en la red"
          value={impact?.length ?? 0}
          icon={<School className="size-4" />}
        />
        <Kpi label="Por revisar" value={pending.length} />
        <Kpi
          label="Talleres"
          value={workshops}
          icon={<Presentation className="size-4" />}
        />
        <Kpi
          label="Escolares"
          value={students}
          icon={<GraduationCap className="size-4" />}
        />
      </KpiGrid>

      <PanelSection title="Solicitudes">
        <SchoolQueue
          applications={(apps ?? []).map((a) => ({
            id: a.id,
            schoolName: a.school_name,
            location: [a.province, a.region].filter(Boolean).join(", "),
            directorName: a.director_name,
            phone: a.contact_phone,
            email: a.contact_email,
            students: a.students_3to5,
            expectations: a.expectations,
            status: a.status,
            createdAt: a.created_at,
          }))}
        />
      </PanelSection>

      <PanelSection title="Impacto por colegio">
        <DataTable
          rows={impact ?? []}
          empty={
            <EmptyState
              icon={<School className="size-5" />}
              title="Sin colegios en la red todavía"
            />
          }
          columns={[
            {
              key: "n",
              header: "Colegio",
              render: (i) => (
                <div>
                  <p className="font-medium text-ink">{i.name}</p>
                  <p className="mt-0.5 text-xs text-slate-ui">
                    {[i.province, i.region].filter(Boolean).join(", ")}
                  </p>
                </div>
              ),
            },
            {
              key: "w",
              header: "Talleres",
              numeric: true,
              render: (i) => i.workshops_done ?? 0,
            },
            {
              key: "s",
              header: "Escolares",
              numeric: true,
              render: (i) => i.students_reached ?? 0,
            },
            {
              key: "f",
              header: "Facilitadores",
              numeric: true,
              render: (i) => i.facilitators ?? 0,
            },
            {
              key: "l",
              header: "Último taller",
              render: (i) => (i.last_workshop ? formatDate(i.last_workshop) : "—"),
            },
          ]}
        />
      </PanelSection>
    </>
  );
}
