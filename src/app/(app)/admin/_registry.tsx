import "server-only";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge, type Column } from "@/components/app/data-views";
import { Badge } from "@/components/ui/primitives";
import {
  formatDate,
  formatDateTime,
  formatSoles,
  initials,
  relativeTime,
} from "@/lib/utils";
import { siteConfig } from "@/config/site";

/**
 * Registro de las vistas de listado del panel de administración.
 *
 * Todas comparten la misma forma —consulta, KPIs y columnas— así que en vez de
 * repetir el layout en diez archivos, cada pantalla declara solo lo suyo y
 * `AdminList` se encarga del resto. Añadir una vista nueva son ~20 líneas aquí.
 */

/**
 * Fila genérica de listado.
 *
 * La forma real la define cada consulta a Supabase en tiempo de ejecución, así
 * que aquí no hay un tipo estático que valga: este registro es deliberadamente
 * dinámico para que añadir una vista cueste veinte líneas y no un modelo nuevo.
 * El tipado fuerte vive donde importa: en las funciones RPC y en las políticas
 * RLS, que son las que protegen los datos.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AdminRow = Record<string, any>;

export interface AdminView {
  title: string;
  description: string;
  /** Devuelve las filas ya normalizadas y los KPIs de cabecera. */
  load: () => Promise<{
    rows: AdminRow[];
    kpis: { label: string; value: string | number; hint?: string }[];
  }>;
  columns: Column<AdminRow>[];
  emptyTitle: string;
  emptyDescription?: string;
}

/* Helpers de render reutilizados por varias vistas */

const person = (name?: string | null, sub?: string | null) => (
  <div className="flex items-center gap-2.5">
    <span className="flex size-7 shrink-0 items-center justify-center rounded-full sep-gradient text-[0.625rem] font-semibold text-white">
      {initials(name ?? "?")}
    </span>
    <div className="min-w-0">
      <p className="truncate font-medium text-ink">{name ?? "—"}</p>
      {sub && <p className="truncate text-xs text-slate-ui">{sub}</p>}
    </div>
  </div>
);

const stack = (main: React.ReactNode, sub?: React.ReactNode) => (
  <div>
    <p className="font-medium text-ink">{main}</p>
    {sub ? <p className="mt-0.5 text-xs text-slate-ui">{sub}</p> : null}
  </div>
);

const one = <T,>(v: T | T[] | null): T | null =>
  Array.isArray(v) ? (v[0] ?? null) : v;

/* ═══════════════ VISTAS ═══════════════ */

export const ADMIN_VIEWS: Record<string, AdminView> = {
  /* ── Cursos ── */
  cursos: {
    title: "Cursos",
    description:
      "Catálogo, cupos y tasa de completación. El contenido se edita en la base de datos.",
    emptyTitle: "Sin cursos cargados",
    async load() {
      const s = await createClient();
      const [{ data: courses }, { data: stats }] = await Promise.all([
        s.from("courses").select("*").order("order_index"),
        s.from("course_stats").select("*"),
      ]);
      const byId = new Map((stats ?? []).map((x) => [x.id, x]));
      const rows = (courses ?? []).map((c) => ({ ...c, stat: byId.get(c.id) }));
      const enroll = rows.reduce((a, r) => a + Number(r.stat?.enrollments ?? 0), 0);
      const done = rows.reduce((a, r) => a + Number(r.stat?.completions ?? 0), 0);
      return {
        rows,
        kpis: [
          { label: "Cursos", value: rows.length },
          { label: "Inscripciones", value: enroll },
          { label: "Completados", value: done },
          {
            label: "Tasa global",
            value: enroll ? `${Math.round((done / enroll) * 100)}%` : "—",
          },
        ],
      };
    },
    columns: [
      { key: "t", header: "Curso", render: (c: AdminRow) => stack(c["title"], c["subtitle"]) },
      { key: "s", header: "Estado", render: (c: AdminRow) => <StatusBadge status={c["status"]} /> },
      { key: "a", header: "Público", render: (c: AdminRow) => <Badge tone="neutral">{c["audience"]}</Badge> },
      { key: "f", header: "Formato", render: (c: AdminRow) => `${c["total_hours"]} h · ${c["sessions_count"]} ses.` },
      {
        key: "p",
        header: "Precio",
        render: (c: AdminRow) =>
          c["is_free"] ? <span className="text-seed-700">Gratis</span> : formatSoles(c["price_cents"]),
      },
      { key: "e", header: "Inscritos", numeric: true, render: (c: AdminRow) => c["stat"]?.enrollments ?? 0 },
      { key: "r", header: "Completan", numeric: true, render: (c: AdminRow) => `${c["stat"]?.completion_rate ?? 0}%` },
    ] as Column<AdminRow>[],
  },

  /* ── Inscripciones ── */
  inscripciones: {
    title: "Inscripciones",
    description: "Quién está en qué curso y cómo va su progreso.",
    emptyTitle: "Sin inscripciones todavía",
    async load() {
      const s = await createClient();
      const { data } = await s
        .from("enrollments")
        .select(
          "id, status, progress_pct, enrolled_at, profiles(full_name, region), courses(title)",
        )
        .order("enrolled_at", { ascending: false })
        .limit(200);
      const rows = (data ?? []).map((e) => ({
        ...e,
        student: one(e.profiles),
        course: one(e.courses),
      }));
      const done = rows.filter((r) => r.status === "completado").length;
      return {
        rows,
        kpis: [
          { label: "Total", value: rows.length },
          { label: "En curso", value: rows.filter((r) => r.status === "activo").length },
          { label: "Completadas", value: done },
          {
            label: "Tasa",
            value: rows.length ? `${Math.round((done / rows.length) * 100)}%` : "—",
          },
        ],
      };
    },
    columns: [
      {
        key: "u",
        header: "Estudiante",
        render: (e: AdminRow) => person(e["student"]?.full_name, e["student"]?.region),
      },
      { key: "c", header: "Curso", render: (e: AdminRow) => e["course"]?.title ?? "—" },
      { key: "s", header: "Estado", render: (e: AdminRow) => <StatusBadge status={e["status"]} /> },
      { key: "p", header: "Progreso", numeric: true, render: (e: AdminRow) => `${e["progress_pct"]}%` },
      { key: "d", header: "Inscrito", render: (e: AdminRow) => formatDate(e["enrolled_at"]) },
    ] as Column<AdminRow>[],
  },

  /* ── Certificados ── */
  certificados: {
    title: "Certificados",
    description:
      "Se emiten solos al aprobar el pago. Aquí queda el registro completo y verificable.",
    emptyTitle: "Aún no se emitió ningún certificado",
    emptyDescription: "Se emiten automáticamente al aprobar un pago desde Pagos.",
    async load() {
      const s = await createClient();
      const [{ data: certs }, { data: stats }] = await Promise.all([
        s
          .from("certificates")
          .select(
            "id, verification_code, status, issued_at, profiles(full_name, email), certificate_types(name, issuer)",
          )
          .order("created_at", { ascending: false })
          .limit(200),
        s.from("certificate_stats").select("*"),
      ]);
      const rows = (certs ?? []).map((c) => ({
        ...c,
        holder: one(c.profiles),
        type: one(c.certificate_types),
      }));
      const revenue = (stats ?? []).reduce((a, x) => a + Number(x.revenue_cents ?? 0), 0);
      return {
        rows,
        kpis: [
          { label: "Emitidos", value: rows.filter((r) => r.status === "emitido").length },
          { label: "Pendientes", value: rows.filter((r) => r.status === "pendiente").length },
          { label: "Revocados", value: rows.filter((r) => r.status === "revocado").length },
          { label: "Ingresos", value: formatSoles(revenue) },
        ],
      };
    },
    columns: [
      {
        key: "h",
        header: "Titular",
        render: (c: AdminRow) => stack(c["holder"]?.full_name, c["holder"]?.email),
      },
      { key: "t", header: "Tipo", render: (c: AdminRow) => stack(c["type"]?.name, c["type"]?.issuer) },
      { key: "s", header: "Estado", render: (c: AdminRow) => <StatusBadge status={c["status"]} /> },
      {
        key: "v",
        header: "Código",
        render: (c: AdminRow) =>
          c["status"] === "emitido" ? (
            <a
              href={`${siteConfig.url}/verificar/${c["verification_code"]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tabular text-xs text-sep-600 hover:underline"
            >
              {c["verification_code"]}
            </a>
          ) : (
            <span className="text-mist">—</span>
          ),
      },
      {
        key: "d",
        header: "Emitido",
        render: (c: AdminRow) => (c["issued_at"] ? formatDate(c["issued_at"]) : "—"),
      },
    ] as Column<AdminRow>[],
  },

  /* ── Instituciones ── */
  instituciones: {
    title: "Instituciones",
    description: "Colegios, universidades, empresas y ONGs registradas.",
    emptyTitle: "Sin instituciones registradas",
    async load() {
      const s = await createClient();
      const { data } = await s
        .from("institutions")
        .select("*")
        .order("created_at", { ascending: false });
      const rows = data ?? [];
      return {
        rows,
        kpis: [
          { label: "Total", value: rows.length },
          { label: "Verificadas", value: rows.filter((r) => r.is_verified).length },
          { label: "Con convenio", value: rows.filter((r) => r.agreement_signed_at).length },
          { label: "Regiones", value: new Set(rows.map((r) => r.region)).size },
        ],
      };
    },
    columns: [
      {
        key: "n",
        header: "Institución",
        render: (i: AdminRow) =>
          stack(i["name"], [i["province"], i["region"]].filter(Boolean).join(", ")),
      },
      { key: "t", header: "Tipo", render: (i: AdminRow) => <Badge tone="neutral">{i["type"]}</Badge> },
      {
        key: "c",
        header: "Contacto",
        render: (i: AdminRow) => stack(i["contact_name"] ?? "—", i["contact_email"]),
      },
      {
        key: "v",
        header: "Estado",
        render: (i: AdminRow) =>
          i["is_verified"] ? (
            <Badge tone="success">Verificada</Badge>
          ) : (
            <Badge tone="warning">Pendiente</Badge>
          ),
      },
      {
        key: "a",
        header: "Convenio",
        render: (i: AdminRow) =>
          i["agreement_signed_at"] ? formatDate(i["agreement_signed_at"]) : "—",
      },
    ] as Column<AdminRow>[],
  },

  /* ── Eventos ── */
  eventos: {
    title: "Eventos",
    description: "Demo Days, ferias, webinars y talleres abiertos.",
    emptyTitle: "Sin eventos creados",
    async load() {
      const s = await createClient();
      const [{ data: events }, { data: regs }] = await Promise.all([
        s.from("events").select("*").order("starts_at", { ascending: false }),
        s.from("event_registrations").select("event_id"),
      ]);
      const count = new Map<string, number>();
      for (const r of regs ?? []) count.set(r.event_id, (count.get(r.event_id) ?? 0) + 1);
      const rows = (events ?? []).map((e) => ({ ...e, regs: count.get(e.id) ?? 0 }));
      return {
        rows,
        kpis: [
          { label: "Eventos", value: rows.length },
          {
            label: "Próximos",
            value: rows.filter((e) => new Date(e.starts_at).getTime() > Date.now()).length,
          },
          { label: "Publicados", value: rows.filter((e) => e.is_published).length },
          { label: "Registros", value: regs?.length ?? 0 },
        ],
      };
    },
    columns: [
      {
        key: "t",
        header: "Evento",
        render: (e: AdminRow) => (
          <div>
            <p className="font-medium text-ink">{e["title"]}</p>
            <p className="mt-0.5 text-xs capitalize text-slate-ui">
              {formatDateTime(e["starts_at"])}
            </p>
          </div>
        ),
      },
      { key: "k", header: "Tipo", render: (e: AdminRow) => <Badge tone="neutral">{e["kind"] ?? "evento"}</Badge> },
      {
        key: "m",
        header: "Modalidad",
        render: (e: AdminRow) =>
          e["is_online"] ? <Badge tone="seed">Virtual</Badge> : <Badge tone="gold">Presencial</Badge>,
      },
      {
        key: "p",
        header: "Visible",
        render: (e: AdminRow) =>
          e["is_published"] ? <Badge tone="success">Publicado</Badge> : <Badge tone="neutral">Borrador</Badge>,
      },
      {
        key: "r",
        header: "Inscritos",
        numeric: true,
        render: (e: AdminRow) => `${e["regs"]}${e["capacity"] ? ` / ${e["capacity"]}` : ""}`,
      },
    ] as Column<AdminRow>[],
  },

  /* ── Newsletter ── */
  newsletter: {
    title: "Newsletter",
    description: "Suscriptores, de dónde llegaron y su estado.",
    emptyTitle: "Sin suscriptores todavía",
    async load() {
      const s = await createClient();
      const { data } = await s
        .from("newsletter_subscribers")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(300);
      const rows = data ?? [];
      return {
        rows,
        kpis: [
          { label: "Activos", value: rows.filter((r) => !r.unsubscribed_at).length },
          { label: "Confirmados", value: rows.filter((r) => r.is_confirmed).length },
          { label: "Bajas", value: rows.filter((r) => r.unsubscribed_at).length },
          {
            label: "Regiones",
            value: new Set(rows.map((r) => r.region).filter(Boolean)).size,
          },
        ],
      };
    },
    columns: [
      { key: "e", header: "Correo", render: (r: AdminRow) => <span className="text-ink">{r["email"]}</span> },
      { key: "n", header: "Nombre", render: (r: AdminRow) => r["full_name"] ?? "—" },
      { key: "g", header: "Región", render: (r: AdminRow) => r["region"] ?? "—" },
      { key: "s", header: "Origen", render: (r: AdminRow) => <Badge tone="neutral">{r["source"] ?? "directo"}</Badge> },
      {
        key: "c",
        header: "Estado",
        render: (r: AdminRow) =>
          r["unsubscribed_at"] ? (
            <Badge tone="neutral">Baja</Badge>
          ) : r["is_confirmed"] ? (
            <Badge tone="success">Confirmado</Badge>
          ) : (
            <Badge tone="warning">Sin confirmar</Badge>
          ),
      },
      { key: "d", header: "Alta", render: (r: AdminRow) => formatDate(r["created_at"]) },
    ] as Column<AdminRow>[],
  },

  /* ── Donaciones ── */
  donaciones: {
    title: "Donaciones",
    description: "Aportes recibidos, su frecuencia y su destino.",
    emptyTitle: "Sin donaciones todavía",
    async load() {
      const s = await createClient();
      const { data } = await s
        .from("donations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      const rows = data ?? [];
      const paid = rows.filter((r) => r.status === "pagado");
      return {
        rows,
        kpis: [
          {
            label: "Total recaudado",
            value: formatSoles(paid.reduce((a, r) => a + r.amount_cents, 0)),
          },
          { label: "Donaciones", value: paid.length },
          { label: "Recurrentes", value: paid.filter((r) => r.is_recurring).length },
          { label: "Por confirmar", value: rows.length - paid.length },
        ],
      };
    },
    columns: [
      {
        key: "d",
        header: "Donante",
        render: (r: AdminRow) =>
          stack(
            r["is_anonymous"] ? "Anónimo" : (r["donor_name"] ?? "—"),
            r["is_anonymous"] ? undefined : r["donor_email"],
          ),
      },
      { key: "a", header: "Monto", numeric: true, render: (r: AdminRow) => formatSoles(r["amount_cents"]) },
      {
        key: "f",
        header: "Frecuencia",
        render: (r: AdminRow) =>
          r["is_recurring"] ? <Badge tone="brand">Mensual</Badge> : <Badge tone="neutral">Única</Badge>,
      },
      { key: "c", header: "Causa", render: (r: AdminRow) => r["cause"] ?? "—" },
      { key: "s", header: "Estado", render: (r: AdminRow) => <StatusBadge status={r["status"]} /> },
      { key: "t", header: "Fecha", render: (r: AdminRow) => formatDate(r["created_at"]) },
    ] as Column<AdminRow>[],
  },

  /* ── Comunidad ── */
  comunidad: {
    title: "Comunidad",
    description: "Moderación del feed. Las publicaciones ocultas dejan de verse al instante.",
    emptyTitle: "Sin publicaciones",
    async load() {
      const s = await createClient();
      const [{ data: posts }, { count: comments }] = await Promise.all([
        s
          .from("posts")
          .select("id, content, created_at, likes_count, is_pinned, is_hidden, profiles(full_name, region)")
          .order("created_at", { ascending: false })
          .limit(80),
        s.from("comments").select("id", { count: "exact", head: true }),
      ]);
      const rows = (posts ?? []).map((p) => ({ ...p, author: one(p.profiles) }));
      return {
        rows,
        kpis: [
          { label: "Publicaciones", value: rows.length },
          { label: "Comentarios", value: comments ?? 0 },
          { label: "Reacciones", value: rows.reduce((a, p) => a + p.likes_count, 0) },
          { label: "Ocultas", value: rows.filter((p) => p.is_hidden).length },
        ],
      };
    },
    columns: [
      {
        key: "a",
        header: "Autor",
        render: (p: AdminRow) => person(p["author"]?.full_name, p["author"]?.region),
      },
      {
        key: "c",
        header: "Contenido",
        render: (p: AdminRow) => <p className="max-w-md truncate">{p["content"]}</p>,
      },
      { key: "l", header: "Likes", numeric: true, render: (p: AdminRow) => p["likes_count"] },
      {
        key: "s",
        header: "Estado",
        render: (p: AdminRow) =>
          p["is_hidden"] ? (
            <Badge tone="danger">Oculta</Badge>
          ) : p["is_pinned"] ? (
            <Badge tone="gold">Fijada</Badge>
          ) : (
            <Badge tone="success">Visible</Badge>
          ),
      },
      { key: "t", header: "Publicada", render: (p: AdminRow) => relativeTime(p["created_at"]) },
    ] as Column<AdminRow>[],
  },
};
