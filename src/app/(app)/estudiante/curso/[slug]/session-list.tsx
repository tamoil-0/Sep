"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, ExternalLink, Loader2, Lock } from "lucide-react";
import { toggleSessionAction } from "@/server/actions/learning";
import { Badge } from "@/components/ui/primitives";
import { formatDateTime, cn } from "@/lib/utils";

interface SessionRow {
  id: string;
  number: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  scheduledAt: string | null;
  meetUrl: string | null;
  status: string;
  isCompleted: boolean;
}

export function SessionList({
  courseSlug,
  enrolled,
  sessions,
}: {
  courseSlug: string;
  enrolled: boolean;
  sessions: SessionRow[];
}) {
  const router = useRouter();
  const [busy, setBusy] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<{ text: string; ok: boolean } | null>(null);
  const [open, setOpen] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(null), 5000);
    return () => clearTimeout(t);
  }, [feedback]);

  async function toggle(session: SessionRow) {
    setBusy(session.id);
    try {
      const result = await toggleSessionAction(
        session.id,
        !session.isCompleted,
        courseSlug,
      );
      if (result.ok) {
        setFeedback({ text: result.message ?? "Progreso actualizado.", ok: true });
        router.refresh();
      } else {
        setFeedback({ text: result.error, ok: false });
      }
    } catch {
      setFeedback({
        text: "No pudimos conectarnos. Tu progreso no cambió; inténtalo nuevamente.",
        ok: false,
      });
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      {feedback && (
        <div
          className={cn(
            "mb-3 rounded-sm border px-4 py-3 text-sm",
            feedback.ok
              ? "border-success/25 bg-success-bg text-success"
              : "border-danger/25 bg-danger-bg text-danger",
          )}
          role="status"
        >
          {feedback.text}
        </div>
      )}

      <ul className="divide-y divide-line overflow-hidden rounded-md border border-line bg-white">
        {sessions.map((s) => {
          const isOpen = open === s.id;
          return (
            <li key={s.id}>
              <div className="flex items-start gap-4 p-4">
                {/* Checkbox de progreso */}
                {enrolled ? (
                  <button
                    type="button"
                    onClick={() => toggle(s)}
                    disabled={busy === s.id}
                    aria-label={
                      s.isCompleted
                        ? `Marcar sesión ${s.number} como pendiente`
                        : `Marcar sesión ${s.number} como completada`
                    }
                    aria-pressed={s.isCompleted}
                    className={cn(
                      "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      s.isCompleted
                        ? "border-seed-500 bg-seed-500 text-white"
                        : "border-line bg-white text-transparent hover:border-sep-400",
                      busy === s.id && "opacity-60",
                    )}
                  >
                    {busy === s.id ? (
                      <Loader2 className="size-3.5 animate-spin text-sep-600" />
                    ) : (
                      <Check className="size-4" />
                    )}
                  </button>
                ) : (
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-2 text-mist">
                    <Lock className="size-3.5" />
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : s.id)}
                  className="min-w-0 flex-1 text-left"
                  aria-expanded={isOpen}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="tabular text-xs font-semibold text-mist">
                      {String(s.number).padStart(2, "0")}
                    </span>
                    <p
                      className={cn(
                        "text-body-sm font-medium",
                        s.isCompleted ? "text-slate-ui" : "text-ink",
                      )}
                    >
                      {s.title}
                    </p>
                    {s.status === "en_vivo" && <Badge tone="danger">En vivo</Badge>}
                  </div>

                  {s.subtitle && (
                    <p className="mt-0.5 text-xs text-slate-ui">{s.subtitle}</p>
                  )}

                  {s.scheduledAt && (
                    <p className="mt-1 text-xs capitalize text-mist">
                      {formatDateTime(s.scheduledAt)}
                    </p>
                  )}

                  {isOpen && s.description && (
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-graphite">
                      {s.description}
                    </p>
                  )}
                </button>

                {enrolled && s.meetUrl && !s.isCompleted && (
                  <a
                    href={s.meetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-control shrink-0 items-center gap-1.5 rounded-sm bg-sep-600 px-3.5 text-sm font-medium text-white transition-colors hover:bg-sep-700"
                  >
                    <ExternalLink className="size-3.5" />
                    Unirme
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
