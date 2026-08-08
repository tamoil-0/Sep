import type { Metadata } from "next";
import Link from "next/link";
import { Bell } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/page-header";
import { Card, EmptyState } from "@/components/ui/primitives";
import { MarkAllReadButton } from "./mark-all-button";
import { relativeTime, cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Notificaciones",
  robots: { index: false, follow: false },
};

export default async function NotificacionesPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const { data } = await supabase
    .from("notifications")
    .select("id, kind, title, body, link, read_at, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(60);

  const rows = data ?? [];
  const unread = rows.filter((n) => !n.read_at).length;

  return (
    <>
      <PageHeader
        title="Notificaciones"
        description={unread ? `Tienes ${unread} sin leer.` : "Estás al día."}
        action={unread > 0 ? <MarkAllReadButton /> : undefined}
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={<Bell className="size-5" />}
          title="Sin notificaciones"
          description="Te avisaremos cuando haya novedades sobre tus cursos, pagos o certificados."
        />
      ) : (
        <Card className="p-0">
          <ul className="divide-y divide-line">
            {rows.map((n) => {
              const content = (
                <div className="flex items-start gap-3.5">
                  <span
                    className={cn(
                      "mt-1.5 size-2 shrink-0 rounded-full",
                      n.read_at ? "bg-line" : "bg-sep-600",
                    )}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "text-[0.9375rem]",
                        n.read_at ? "text-graphite" : "font-medium text-ink",
                      )}
                    >
                      {n.title}
                    </p>
                    {n.body && (
                      <p className="mt-1 text-sm leading-relaxed text-slate-ui">{n.body}</p>
                    )}
                    <p className="mt-1.5 text-xs text-mist">{relativeTime(n.created_at)}</p>
                  </div>
                </div>
              );

              return (
                <li key={n.id}>
                  {n.link ? (
                    <Link href={n.link} className="block px-5 py-4 transition-colors hover:bg-surface-1">
                      {content}
                    </Link>
                  ) : (
                    <div className="px-5 py-4">{content}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </>
  );
}

