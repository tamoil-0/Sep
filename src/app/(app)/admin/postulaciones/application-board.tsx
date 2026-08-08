"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Clock, Loader2, Mic, UserRound, X } from "lucide-react";
import {
  approveHoursAction,
  approveSpeakerAction,
  updateApplicationStatusAction,
} from "@/server/actions/admin";
import { Badge, Card, EmptyState } from "@/components/ui/primitives";
import { formatDate, relativeTime, initials, cn } from "@/lib/utils";

interface VolunteerApp {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  region: string | null;
  university: string | null;
  careerCycle: string | null;
  motivation: string | null;
  completedCourses: string | null;
  status: string;
  createdAt: string;
  hasAccount: boolean;
  roleName: string;
}

interface SpeakerApp {
  id: string;
  name: string;
  email: string;
  location: string;
  expertise: string | null;
  topics: string[];
  story: string | null;
  experience: string | null;
  availability: string | null;
  approved: boolean;
  createdAt: string;
}

interface HoursRow {
  id: string;
  date: string;
  hours: number;
  activity: string;
  volunteerName: string;
  region: string | null;
}

const statusTone = {
  recibida: "neutral",
  en_revision: "warning",
  entrevista: "brand",
  aprobada: "success",
  rechazada: "danger",
} as const;

const statusLabel: Record<string, string> = {
  recibida: "Recibida",
  en_revision: "En revisión",
  entrevista: "Entrevista",
  aprobada: "Aprobada",
  rechazada: "Rechazada",
};

const FLOW = ["recibida", "en_revision", "entrevista", "aprobada", "rechazada"] as const;

export function ApplicationBoard({
  volunteers,
  speakers,
  hours,
}: {
  volunteers: VolunteerApp[];
  speakers: SpeakerApp[];
  hours: HoursRow[];
}) {
  const router = useRouter();
  const [tab, setTab] = React.useState<"voluntariado" | "speakers" | "horas">(
    "voluntariado",
  );
  const [busy, setBusy] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<{ text: string; ok: boolean } | null>(null);
  const [expanded, setExpanded] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(null), 5000);
    return () => clearTimeout(t);
  }, [feedback]);

  async function run(id: string, fn: () => Promise<{ ok: boolean; message?: string; error?: string }>) {
    setBusy(id);
    const result = await fn();
    setBusy(null);
    setFeedback({
      text: result.ok ? (result.message ?? "Listo.") : (result.error ?? "Error."),
      ok: result.ok,
    });
    if (result.ok) router.refresh();
  }

  const pendingVolunteers = volunteers.filter(
    (v) => v.status !== "aprobada" && v.status !== "rechazada",
  ).length;
  const pendingSpeakers = speakers.filter((s) => !s.approved).length;

  const tabs = [
    { key: "voluntariado" as const, label: "Voluntariado", count: pendingVolunteers, total: volunteers.length },
    { key: "speakers" as const, label: "Speakers", count: pendingSpeakers, total: speakers.length },
    { key: "horas" as const, label: "Horas por aprobar", count: hours.length, total: hours.length },
  ];

  return (
    <>
      {feedback && (
        <div
          className={cn(
            "mb-4 rounded-[10px] px-4 py-3 text-sm",
            feedback.ok
              ? "border border-success/25 bg-success-bg text-success"
              : "border border-danger/25 bg-danger-bg text-danger",
          )}
          role="status"
        >
          {feedback.text}
        </div>
      )}

      <div className="mb-5 flex flex-wrap gap-1.5">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              tab === t.key
                ? "bg-sep-600 text-white"
                : "bg-white text-graphite ring-1 ring-inset ring-line hover:bg-surface-2",
            )}
          >
            {t.label}
            {t.count > 0 && (
              <span
                className={cn(
                  "tabular ml-1.5 rounded-full px-1.5 text-xs",
                  tab === t.key ? "bg-white/20" : "bg-gold-500/20 text-gold-700",
                )}
              >
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Voluntariado ── */}
      {tab === "voluntariado" &&
        (volunteers.length === 0 ? (
          <EmptyState icon={<UserRound className="size-5" />} title="Sin postulaciones" />
        ) : (
          <div className="space-y-3">
            {volunteers.map((v) => (
              <Card key={v.id} className="p-5">
                <div className="flex flex-wrap items-start gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full sep-gradient text-xs font-semibold text-white">
                    {initials(v.name)}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-[0.9375rem] font-semibold text-ink">
                        {v.name}
                      </p>
                      <Badge tone={statusTone[v.status as keyof typeof statusTone] ?? "neutral"}>
                        {statusLabel[v.status] ?? v.status}
                      </Badge>
                      <Badge tone="gold">{v.roleName}</Badge>
                      {!v.hasAccount && <Badge tone="warning">Sin cuenta</Badge>}
                    </div>

                    <p className="mt-1 text-xs text-slate-ui">
                      {v.email} · {v.region ?? "—"} · {relativeTime(v.createdAt)}
                    </p>

                    <button
                      type="button"
                      onClick={() => setExpanded(expanded === v.id ? null : v.id)}
                      className="mt-2 text-xs font-medium text-sep-600 hover:underline"
                    >
                      {expanded === v.id ? "Ocultar detalle" : "Ver postulación completa"}
                    </button>

                    {expanded === v.id && (
                      <dl className="mt-3 space-y-2.5 rounded-[10px] bg-surface-1 p-4 text-sm">
                        {[
                          ["Universidad", v.university],
                          ["Carrera y ciclo", v.careerCycle],
                          ["WhatsApp", v.phone],
                          ["Cursos completados", v.completedCourses],
                          ["Motivación", v.motivation],
                        ].map(([label, value]) =>
                          value ? (
                            <div key={label as string}>
                              <dt className="text-xs font-medium text-slate-ui">{label}</dt>
                              <dd className="mt-0.5 leading-relaxed text-graphite">{value}</dd>
                            </div>
                          ) : null,
                        )}
                      </dl>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5 border-t border-line pt-4">
                  {FLOW.map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={v.status === s || busy === v.id || (s === "aprobada" && !v.hasAccount)}
                      title={
                        s === "aprobada" && !v.hasAccount
                          ? "Necesita tener cuenta para recibir el rol de mentor"
                          : undefined
                      }
                      onClick={() =>
                        run(v.id, () =>
                          updateApplicationStatusAction(v.id, s),
                        )
                      }
                      className={cn(
                        "inline-flex h-8 items-center gap-1.5 rounded-[8px] px-3 text-xs font-medium transition-colors disabled:opacity-40",
                        s === "aprobada"
                          ? "bg-success text-white hover:opacity-90"
                          : s === "rechazada"
                            ? "border border-danger/30 text-danger hover:bg-danger-bg"
                            : "border border-line text-graphite hover:bg-surface-2",
                      )}
                    >
                      {busy === v.id && <Loader2 className="size-3 animate-spin" />}
                      {statusLabel[s]}
                    </button>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        ))}

      {/* ── Speakers ── */}
      {tab === "speakers" &&
        (speakers.length === 0 ? (
          <EmptyState icon={<Mic className="size-5" />} title="Sin speakers registrados" />
        ) : (
          <div className="space-y-3">
            {speakers.map((s) => (
              <Card key={s.id} className="p-5">
                <div className="flex flex-wrap items-start gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full sep-gradient text-xs font-semibold text-white">
                    {initials(s.name)}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-[0.9375rem] font-semibold text-ink">
                        {s.name}
                      </p>
                      <Badge tone={s.approved ? "success" : "warning"}>
                        {s.approved ? "Publicado" : "Por revisar"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-slate-ui">
                      {s.email} · {s.location} · {relativeTime(s.createdAt)}
                    </p>
                    {s.expertise && (
                      <p className="mt-2 text-sm text-graphite">{s.expertise}</p>
                    )}
                    {s.topics.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {s.topics.map((t) => (
                          <Badge key={t} tone="brand">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {s.story && (
                      <p className="mt-3 rounded-[10px] bg-surface-1 p-3.5 text-sm leading-relaxed text-graphite">
                        “{s.story}”
                      </p>
                    )}
                    <p className="mt-2 text-xs text-slate-ui">
                      Experiencia: {s.experience ?? "—"} · Disponibilidad:{" "}
                      {s.availability ?? "—"}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-1.5">
                    <button
                      type="button"
                      disabled={busy === s.id}
                      onClick={() => run(s.id, () => approveSpeakerAction(s.id, !s.approved))}
                      className={cn(
                        "inline-flex h-8 items-center gap-1.5 rounded-[8px] px-3 text-xs font-medium transition-colors disabled:opacity-40",
                        s.approved
                          ? "border border-line text-graphite hover:bg-surface-2"
                          : "bg-success text-white hover:opacity-90",
                      )}
                    >
                      {busy === s.id ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : s.approved ? (
                        <X className="size-3.5" />
                      ) : (
                        <Check className="size-3.5" />
                      )}
                      {s.approved ? "Despublicar" : "Aprobar"}
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ))}

      {/* ── Horas ── */}
      {tab === "horas" &&
        (hours.length === 0 ? (
          <EmptyState
            icon={<Clock className="size-5" />}
            title="Nada por aprobar"
            description="Todas las horas de voluntariado están al día."
          />
        ) : (
          <Card className="overflow-hidden p-0">
            <ul className="divide-y divide-line">
              {hours.map((h) => (
                <li key={h.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink">{h.volunteerName}</p>
                    <p className="mt-0.5 text-xs text-slate-ui">
                      {formatDate(h.date)}
                      {h.region ? ` · ${h.region}` : ""}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-graphite">
                      {h.activity}
                    </p>
                  </div>

                  <p className="tabular shrink-0 font-display text-lg font-semibold text-ink">
                    {h.hours} h
                  </p>

                  <button
                    type="button"
                    disabled={busy === h.id}
                    onClick={() => run(h.id, () => approveHoursAction(h.id))}
                    className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[8px] bg-success px-3 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                  >
                    {busy === h.id ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : (
                      <Check className="size-3.5" />
                    )}
                    Aprobar
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        ))}
    </>
  );
}
