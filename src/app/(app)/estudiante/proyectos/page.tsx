import type { Metadata } from "next";
import { Lightbulb, MapPin } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import { Badge, Card, EmptyState } from "@/components/ui/primitives";
import { PanelSection } from "@/components/app/data-views";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Mis proyectos" };

export default async function ProyectosPage() {
  const user = await requireRole(["estudiante", "mentor", "admin", "super_admin"]);
  const supabase = await createClient();

  const [{ data: mine }, { data: others }] = await Promise.all([
    supabase.from("projects").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase
      .from("projects")
      .select("id, title, problem, solution, region, profiles(full_name)")
      .eq("is_public", true)
      .neq("user_id", user.id)
      .limit(6),
  ]);

  const rows = mine ?? [];

  return (
    <>
      <PageHeader
        title="Mis proyectos"
        description="Lo que estás construyendo con lo aprendido. Los proyectos nacen en la sesión 6 de cada curso."
      />

      <KpiGrid>
        <Kpi label="Mis proyectos" value={rows.length} icon={<Lightbulb className="size-4" />} />
        <Kpi label="Públicos" value={rows.filter((p) => p.is_public).length} />
        <Kpi label="Tu región" value={user.region ?? "—"} icon={<MapPin className="size-4" />} />
        <Kpi label="De la comunidad" value={others?.length ?? 0} />
      </KpiGrid>

      <PanelSection title="Mis proyectos">
        {rows.length === 0 ? (
          <EmptyState
            icon={<Lightbulb className="size-5" />}
            title="Aún no registras ningún proyecto"
            description="En la última sesión de cada curso diseñas un proyecto para tu comunidad. Ahí aparecerá."
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {rows.map((p) => (
              <Card key={p.id} className="p-5">
                <div className="flex flex-wrap items-center gap-1.5">
                  {p.region && <Badge tone="brand">{p.region}</Badge>}
                  {p.is_public ? <Badge tone="seed">Público</Badge> : <Badge tone="neutral">Privado</Badge>}
                </div>
                <h3 className="mt-3 font-display text-[1.0625rem] font-semibold text-ink">{p.title}</h3>
                {p.problem && (
                  <>
                    <p className="mt-3 text-xs uppercase tracking-[0.08em] text-slate-ui">El problema</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-ui">{p.problem}</p>
                  </>
                )}
                {p.solution && (
                  <>
                    <p className="mt-3 text-xs uppercase tracking-[0.08em] text-seed-700">La solución</p>
                    <p className="mt-1 text-sm leading-relaxed text-graphite">{p.solution}</p>
                  </>
                )}
                <p className="mt-4 text-xs text-mist">Creado el {formatDate(p.created_at)}</p>
              </Card>
            ))}
          </div>
        )}
      </PanelSection>

      {(others?.length ?? 0) > 0 && (
        <PanelSection title="De la comunidad">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {(others ?? []).map((p) => {
              const author = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles;
              return (
                <Card key={p.id} className="p-5">
                  {p.region && <Badge tone="neutral">{p.region}</Badge>}
                  <h3 className="mt-3 font-display text-[0.9375rem] font-semibold text-ink">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-ui">{p.solution}</p>
                  <p className="mt-3 text-xs text-mist">{author?.full_name}</p>
                </Card>
              );
            })}
          </div>
        </PanelSection>
      )}
    </>
  );
}
