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
import { useToast } from "@/components/ui/toast";

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
  const [confirming, setConfirming] = React.useState<string | null>(null);
  const toast = useToast();

  React.useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(null), 5000);
    return () => clearTimeout(t);
  }, [feedback]);

  async function run(id: string, fn: () => Promise<{ ok: boolean; message?: string; error?: string }>) {
    setBusy(id);
    try {
      const result = await fn();
      const text = result.ok
        ? (result.message ?? "Cambio guardado.")
        : (result.error ?? "No pudimos guardar el cambio.");
      setFeedback({ text, ok: result.ok });
      toast({
        title: text,
        tone: result.ok ? "success" : "error",
      });
      if (result.ok) router.refresh();
    } catch {
      const text = "No pudimos conectarnos. Revisa tu conexión e inténtalo nuevamente.";
      setFeedback({ text, ok: false });
      toast({ title: "No se guardó el cambio", description: text, tone: "error" });
    } finally {
      setBusy(null);
      setConfirming(null);
    }
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
            "mb-4 rounded-sm px-4 py-3 text-sm",
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
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sep-700 text-xs font-semibold text-white">
                    {initials(v.name)}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-body-sm font-semibold text-ink">
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
                      <dl className="mt-3 space-y-2.5 rounded-sm bg-surface-1 p-4 text-sm">
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
                        s === "aprobada" || s === "rechazada"
                          ? setConfirming(`${v.id}:${s}`)
                          : run(v.id, () => updateApplicationStatusAction(v.id, s))
                      }
                      className={cn(
                        "inline-flex min-h-control items-center gap-1.5 rounded-sm px-3 text-xs font-medium transition-colors disabled:opacity-40",
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
                {(confirming === `${v.id}:aprobada` || confirming === `${v.id}:rechazada`) && (
                  <div className={cn(
                    "mt-3 rounded-sm border p-4",
                    confirming.endsWith(":rechazada")
                      ? "border-danger/25 bg-danger-bg"
                      : "border-success/25 bg-success-bg",
                  )}>
                    <p className="text-body-sm font-semibold text-ink">
                      {confirming.endsWith(":rechazada")
                        ? `Rechazar la postulación de ${v.name}`
                        : `Aprobar la postulación de ${v.name}`}
                    </p>
                    <p className="mt-1 text-caption text-graphite">
                      {confirming.endsWith(":rechazada")
                        ? "La postulación quedará cerrada como rechazada. Verifica el detalle antes de continuar."
                        : "La aprobación otorgará automáticamente el rol correspondiente a esta cuenta."}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={busy === v.id}
                        onClick={() => {
                          const status = confirming.endsWith(":rechazada") ? "rechazada" : "aprobada";
                          void run(v.id, () => updateApplicationStatusAction(v.id, status));
                        }}
                        className={cn(
                          "min-h-control rounded-sm px-4 text-body-sm font-semibold text-white disabled:opacity-50",
                          confirming.endsWith(":rechazada") ? "bg-danger" : "bg-success",
                        )}
                      >
                        {confirming.endsWith(":rechazada") ? "Confirmar rechazo" : "Aprobar y otorgar rol"}
                      </button>
                      <button type="button" onClick={() => setConfirming(null)} className="min-h-control rounded-sm px-4 text-body-sm font-semibold text-graphite hover:bg-white">
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
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
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sep-700 text-xs font-semibold text-white">
                    {initials(s.name)}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-body-sm font-semibold text-ink">
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
                      <p className="mt-3 rounded-sm bg-surface-1 p-3.5 text-sm leading-relaxed text-graphite">
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
                      onClick={() => setConfirming(`speaker:${s.id}:${s.approved ? "hide" : "publish"}`)}
                      className={cn(
                        "inline-flex min-h-control items-center gap-1.5 rounded-sm px-3 text-xs font-medium transition-colors disabled:opacity-40",
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
                {confirming?.startsWith(`speaker:${s.id}:`) && (
                  <div className={cn(
                    "mt-4 rounded-sm border p-4",
                    s.approved ? "border-danger/25 bg-danger-bg" : "border-success/25 bg-success-bg",
                  )}>
                    <p className="text-body-sm font-semibold text-ink">
                      {s.approved ? `Despublicar a ${s.name}` : `Publicar a ${s.name} como speaker`}
                    </p>
                    <p className="mt-1 text-caption text-graphite">
                      {s.approved
                        ? "Su perfil dejará de aparecer públicamente hasta que vuelvas a aprobarlo."
                        : "Su nombre, perfil y temas pasarán a ser visibles en la red pública de speakers."}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={busy === s.id}
                        onClick={() => void run(s.id, () => approveSpeakerAction(s.id, !s.approved))}
                        className={cn(
                          "min-h-control rounded-sm px-4 text-body-sm font-semibold text-white disabled:opacity-50",
                          s.approved ? "bg-danger" : "bg-success",
                        )}
                      >
                        {s.approved ? "Despublicar perfil" : "Aprobar y publicar"}
                      </button>
                      <button type="button" onClick={() => setConfirming(null)} className="min-h-control rounded-sm px-4 text-body-sm font-semibold text-graphite hover:bg-white">
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
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
                    className="inline-flex min-h-control shrink-0 items-center gap-1.5 rounded-sm bg-success px-3 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
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
