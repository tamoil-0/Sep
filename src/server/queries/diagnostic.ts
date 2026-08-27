import "server-only";
import { createClient } from "@/lib/supabase/server";
import { assertQueryResults } from "@/lib/supabase/query";
import type { Json, SurveyProfileDb } from "@/types/database";

/**
 * Lectura del diagnóstico de entrada para el panel de administración.
 *
 * La pantalla y la exportación a Excel comparten este módulo a propósito: si
 * los filtros vivieran en dos sitios, el archivo descargado y lo que el equipo
 * ve en pantalla acabarían diciendo cosas distintas.
 */

export const DIAGNOSTIC_PROFILES = [
  {
    key: "universitario",
    label: "Estudiantes",
    singular: "Estudiante",
    sheet: "Universitarios",
    emoji: "🎓",
    /** Cabecera de la columna «organización» en la hoja de ese perfil. */
    organizationHeader: "Universidad",
  },
  {
    key: "docente",
    label: "Docentes",
    singular: "Docente",
    sheet: "Docentes",
    emoji: "📚",
    organizationHeader: "Institución educativa",
  },
  {
    key: "empresa",
    label: "Organizaciones",
    singular: "Organización",
    sheet: "Organizaciones",
    emoji: "🏢",
    organizationHeader: "Empresa u organización",
  },
] as const;

export type DiagnosticProfileMeta = (typeof DIAGNOSTIC_PROFILES)[number];

/** Los tres módulos en los que el wizard agrupa las 15 preguntas. */
export const DIAGNOSTIC_MODULES = [
  "Tu punto de partida",
  "Lo que quieres lograr",
  "Tus próximos pasos",
];

export type DiagnosticOrigin = "todos" | "feria" | "cuenta" | "publico";
/** `reales` deja fuera el ecosistema de demostración; `todos` lo incluye. */
export type DiagnosticDataset = "reales" | "todos";

export const ORIGIN_LABELS: Record<Exclude<DiagnosticOrigin, "todos">, string> = {
  feria: "Feria · Apoya hoy",
  cuenta: "Cuenta SEP",
  publico: "Diagnóstico público",
};

/**
 * El seed de demostración marca sus 90 encuestas con correos `@demo.sep.pe`
 * y se limpia a sí mismo borrando exactamente ese patrón
 * (ver `supabase/seeds/demo.sql`). Reutilizamos la misma marca para que
 * «respuestas reales» signifique aquí lo mismo que en la base de datos.
 *
 * Las participaciones de feria no tienen correo: su `email` es `null` y nunca
 * caen en este filtro.
 */
const DEMO_EMAIL_DOMAIN = "@demo.sep.pe";

export function isDemoLead(email: string | null | undefined): boolean {
  return (email ?? "").toLocaleLowerCase("en").endsWith(DEMO_EMAIL_DOMAIN);
}

export interface DiagnosticQuestion {
  id: string;
  profile: SurveyProfileDb;
  number: number;
  block: number;
  blockTitle: string | null;
  question: string;
  inputType: string;
  options: string[];
  validates: string | null;
  tag: string | null;
  isKey: boolean;
}

export interface DiagnosticParticipant {
  id: string;
  profile: SurveyProfileDb;
  name: string;
  email: string | null;
  phone: string | null;
  region: string | null;
  organization: string | null;
  situation: string | null;
  origin: Exclude<DiagnosticOrigin, "todos">;
  utmSource: string | null;
  completedAt: string | null;
  isDemo: boolean;
  /** Respuestas por número de pregunta, siempre como lista de etiquetas. */
  answers: Record<number, string[]>;
}

export interface DiagnosticTrend {
  profile: SurveyProfileDb;
  number: number;
  question: string;
  tag: string | null;
  isKey: boolean;
  option: string;
  votes: number;
  /** Sobre el total de selecciones de esa pregunta, como `diagnostic_results`. */
  pct: number;
}

export interface DiagnosticFilters {
  profiles: SurveyProfileDb[];
  origin: DiagnosticOrigin;
  search: string;
  dataset: DiagnosticDataset;
}

export interface DiagnosticSnapshot {
  filters: DiagnosticFilters;
  questions: DiagnosticQuestion[];
  participants: DiagnosticParticipant[];
  trends: DiagnosticTrend[];
  /** Encuestas de demostración descartadas por el filtro `reales`. */
  demoExcluded: number;
  /** `true` si se alcanzó el tope de filas y la descarga queda incompleta. */
  truncated: boolean;
}

/* ── Paginación ───────────────────────────────────────────── */

/** PostgREST corta en 1000 filas por respuesta; paginamos siempre. */
const PAGE_SIZE = 1000;
/** Tope de encuestas por descarga. Con 15 respuestas cada una son 75 000 filas. */
const MAX_LEADS = 5000;
/** Lotes de ids para no construir URLs kilométricas. */
const ID_CHUNK = 60;

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

/* ── Normalización ────────────────────────────────────────── */

/** Una respuesta puede ser un texto o una lista; la tratamos siempre como lista. */
function answerLabels(answer: Json): string[] {
  if (Array.isArray(answer)) return answer.map(String).filter(Boolean);
  if (typeof answer === "string" || typeof answer === "number") return [String(answer)];
  return [];
}

function originOf(lead: { user_id: string | null; utm_source: string | null }) {
  if (lead.utm_source === "apoya_hoy" || lead.utm_source === "feria") return "feria" as const;
  return lead.user_id ? ("cuenta" as const) : ("publico" as const);
}

/* ── Consulta principal ───────────────────────────────────── */

/**
 * Trae las encuestas completadas con sus respuestas ya emparejadas.
 *
 * RLS decide el acceso: `survey_leads_admin_select` y
 * `survey_responses_admin_select` solo devuelven filas a admin y super_admin,
 * así que no hace falta el cliente de service-role.
 */
export async function loadDiagnostic(
  filters: DiagnosticFilters,
): Promise<DiagnosticSnapshot> {
  const supabase = await createClient();
  const profiles = filters.profiles.length
    ? filters.profiles
    : DIAGNOSTIC_PROFILES.map((profile) => profile.key);

  const [questionRows, leadRows] = await Promise.all([
    supabase
      .from("survey_questions")
      .select(
        "id, profile, block, block_title, number, question, input_type, options, validates, tag, is_key",
      )
      .in("profile", profiles)
      .order("profile")
      .order("number"),
    fetchLeads(supabase, profiles),
  ]);

  const questions: DiagnosticQuestion[] = (questionRows.data ?? []).map((row) => ({
    id: row.id,
    profile: row.profile,
    number: row.number,
    block: row.block,
    blockTitle: row.block_title,
    question: row.question,
    inputType: row.input_type,
    options: Array.isArray(row.options) ? row.options.map(String) : [],
    validates: row.validates,
    tag: row.tag,
    isKey: row.is_key,
  }));
  const numberByQuestionId = new Map(questions.map((question) => [question.id, question.number]));

  // 1. Descartar el ecosistema de demostración antes que nada.
  const demoExcluded = leadRows.rows.filter((lead) => isDemoLead(lead.email)).length;
  const realLeads =
    filters.dataset === "todos"
      ? leadRows.rows
      : leadRows.rows.filter((lead) => !isDemoLead(lead.email));

  // 2. Datos del perfil SEP, para las encuestas hechas desde una cuenta.
  const userIds = [
    ...new Set(realLeads.flatMap((lead) => (lead.user_id ? [lead.user_id] : []))),
  ];
  const accounts = await fetchAccounts(supabase, userIds);

  // 3. Origen y búsqueda, con los mismos criterios que la pantalla.
  const search = filters.search.trim().toLocaleLowerCase("es");
  const filtered = realLeads.filter((lead) => {
    if (filters.origin !== "todos" && originOf(lead) !== filters.origin) return false;
    if (!search) return true;

    const account = lead.user_id ? accounts.profiles.get(lead.user_id) : null;
    return [account?.full_name, lead.full_name, lead.email, account?.region, lead.region]
      .filter(Boolean)
      .some((value) => value!.toLocaleLowerCase("es").includes(search));
  });

  // 4. Las respuestas, solo de las encuestas que realmente vamos a exportar.
  const responses = await fetchResponses(
    supabase,
    filtered.map((lead) => lead.id),
  );
  const answersByLead = new Map<string, Record<number, string[]>>();

  for (const response of responses) {
    const number = numberByQuestionId.get(response.question_id);
    if (number === undefined) continue;
    const bucket = answersByLead.get(response.lead_id) ?? {};
    bucket[number] = answerLabels(response.answer);
    answersByLead.set(response.lead_id, bucket);
  }

  const participants: DiagnosticParticipant[] = filtered.map((lead) => {
    const account = lead.user_id ? accounts.profiles.get(lead.user_id) : null;
    const institution = account?.institution_id
      ? accounts.institutions.get(account.institution_id) ?? null
      : null;

    return {
      id: lead.id,
      profile: lead.profile,
      name: account?.full_name?.trim() || lead.full_name?.trim() || "Participante público",
      email: lead.email,
      phone: account?.phone ?? null,
      region: account?.region || lead.region || null,
      organization: institution || account?.university || null,
      situation: account?.current_situation || account?.career || null,
      origin: originOf(lead),
      utmSource: lead.utm_source,
      completedAt: lead.completed_at ?? lead.created_at,
      isDemo: isDemoLead(lead.email),
      answers: answersByLead.get(lead.id) ?? {},
    };
  });

  return {
    // Devolvemos los perfiles ya resueltos: la portada del Excel y la pantalla
    // leen de aquí, y «sin filtro» tiene que significar «los tres».
    filters: { ...filters, profiles },
    questions,
    participants,
    trends: buildTrends(questions, participants),
    demoExcluded: filters.dataset === "todos" ? 0 : demoExcluded,
    truncated: leadRows.truncated,
  };
}

/**
 * Distribución agregada por pregunta.
 *
 * El denominador es el total de *selecciones*, no de personas — igual que la
 * función `diagnostic_results` de Postgres — para que los porcentajes de la
 * hoja «Tendencias» cuadren con los que muestra el panel.
 */
function buildTrends(
  questions: DiagnosticQuestion[],
  participants: DiagnosticParticipant[],
): DiagnosticTrend[] {
  const trends: DiagnosticTrend[] = [];

  for (const question of questions) {
    const votes = new Map<string, number>();
    let total = 0;

    for (const participant of participants) {
      if (participant.profile !== question.profile) continue;
      for (const label of participant.answers[question.number] ?? []) {
        votes.set(label, (votes.get(label) ?? 0) + 1);
        total += 1;
      }
    }

    if (!total) continue;

    const ordered = [...votes.entries()].sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"),
    );

    for (const [option, count] of ordered) {
      trends.push({
        profile: question.profile,
        number: question.number,
        question: question.question,
        tag: question.tag,
        isKey: question.isKey,
        option,
        votes: count,
        pct: Math.round((count * 1000) / total) / 10,
      });
    }
  }

  return trends;
}

/* ── Totales de cabecera ──────────────────────────────────── */

export interface DiagnosticCounts {
  total: number;
  withAccount: number;
  fair: number;
  byProfile: Record<SurveyProfileDb, number>;
}

/**
 * Totales de los tres perfiles a la vez, para los KPIs.
 *
 * Va paginado igual que el resto: una consulta suelta se quedaría en las
 * primeras 1000 filas y los KPIs mentirían en cuanto la feria despegue.
 */
export async function loadDiagnosticCounts(
  dataset: DiagnosticDataset,
): Promise<DiagnosticCounts> {
  const supabase = await createClient();
  const counts: DiagnosticCounts = {
    total: 0,
    withAccount: 0,
    fair: 0,
    byProfile: { universitario: 0, docente: 0, empresa: 0 },
  };

  for (let from = 0; from < MAX_LEADS; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("survey_leads")
      .select("profile, email, user_id, utm_source")
      .eq("completed", true)
      .order("id")
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      assertQueryResults("admin:diagnostico:conteo", { error });
    }
    if (!data?.length) break;

    for (const lead of data) {
      if (dataset === "reales" && isDemoLead(lead.email)) continue;
      counts.total += 1;
      if (lead.user_id) counts.withAccount += 1;
      if (lead.utm_source === "apoya_hoy" || lead.utm_source === "feria") counts.fair += 1;
      counts.byProfile[lead.profile] += 1;
    }

    if (data.length < PAGE_SIZE) break;
  }

  return counts;
}

/* ── Consultas paginadas ──────────────────────────────────── */

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

interface LeadRow {
  id: string;
  user_id: string | null;
  full_name: string | null;
  email: string | null;
  profile: SurveyProfileDb;
  region: string | null;
  utm_source: string | null;
  completed_at: string | null;
  created_at: string;
}

async function fetchLeads(
  supabase: SupabaseServerClient,
  profiles: SurveyProfileDb[],
): Promise<{ rows: LeadRow[]; truncated: boolean }> {
  const rows: LeadRow[] = [];

  for (let from = 0; from < MAX_LEADS; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("survey_leads")
      .select(
        "id, user_id, full_name, email, profile, region, utm_source, completed_at, created_at",
      )
      .in("profile", profiles)
      .eq("completed", true)
      .order("completed_at", { ascending: false, nullsFirst: false })
      // Desempate estable: sin él, dos encuestas con la misma fecha podrían
      // repetirse o perderse al pasar de página.
      .order("id")
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      assertQueryResults("admin:diagnostico:encuestas", { error });
    }
    if (!data?.length) return { rows, truncated: false };

    rows.push(...data);
    if (data.length < PAGE_SIZE) return { rows, truncated: false };
  }

  return { rows, truncated: rows.length >= MAX_LEADS };
}

async function fetchAccounts(supabase: SupabaseServerClient, userIds: string[]) {
  const profiles = new Map<
    string,
    {
      full_name: string | null;
      phone: string | null;
      region: string | null;
      university: string | null;
      career: string | null;
      current_situation: string | null;
      institution_id: string | null;
    }
  >();

  for (const ids of chunk(userIds, ID_CHUNK)) {
    const result = await supabase
      .from("profiles")
      .select(
        "id, full_name, phone, region, university, career, current_situation, institution_id",
      )
      .in("id", ids);
    assertQueryResults("admin:diagnostico:perfiles", result);
    const data = result.data;

    for (const row of data ?? []) profiles.set(row.id, row);
  }

  const institutionIds = [
    ...new Set(
      [...profiles.values()].flatMap((profile) =>
        profile.institution_id ? [profile.institution_id] : [],
      ),
    ),
  ];
  const institutions = new Map<string, string>();

  for (const ids of chunk(institutionIds, ID_CHUNK)) {
    const result = await supabase.from("institutions").select("id, name").in("id", ids);
    assertQueryResults("admin:diagnostico:instituciones", result);
    const data = result.data;
    for (const row of data ?? []) institutions.set(row.id, row.name);
  }

  return { profiles, institutions };
}

async function fetchResponses(supabase: SupabaseServerClient, leadIds: string[]) {
  const rows: { lead_id: string; question_id: string; answer: Json }[] = [];

  for (const ids of chunk(leadIds, ID_CHUNK)) {
    for (let from = 0; ; from += PAGE_SIZE) {
      const { data, error } = await supabase
        .from("survey_responses")
        .select("lead_id, question_id, answer")
        .in("lead_id", ids)
        .order("lead_id")
        .order("question_id")
        .range(from, from + PAGE_SIZE - 1);

      if (error) {
        assertQueryResults("admin:diagnostico:respuestas", { error });
      }
      if (!data?.length) break;

      rows.push(...data);
      if (data.length < PAGE_SIZE) break;
    }
  }

  return rows;
}
