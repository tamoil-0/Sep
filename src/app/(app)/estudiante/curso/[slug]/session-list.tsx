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
  const [toast, setToast] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  async function toggle(session: SessionRow) {
    setBusy(session.id);
    const result = await toggleSessionAction(
      session.id,
      !session.isCompleted,
      courseSlug,
    );
    setBusy(null);

    if (result.ok) {
      if (result.message) setToast(result.message);
      router.refresh();
    } else {
      setToast(result.error);
    }
  }

  return (
    <>
      {toast && (
        <div
          className="mb-3 rounded-[10px] border border-sep-200 bg-sep-50 px-4 py-3 text-sm text-sep-700"
          role="status"
        >
          {toast}
        </div>
      )}

      <ul className="divide-y divide-line overflow-hidden rounded-[14px] border border-line bg-white">
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
                      "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition-all",
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
                        "text-[0.9375rem] font-medium",
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
                    className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[8px] bg-sep-600 px-3.5 text-sm font-medium text-white transition-colors hover:bg-sep-700"
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
