"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, ShieldCheck, X } from "lucide-react";
import { grantRoleAction, revokeRoleAction } from "@/server/actions/admin";
import { Badge, Card, EmptyState } from "@/components/ui/primitives";
import { Input } from "@/components/forms/field";
import { ROLE_META, USER_ROLES, type UserRole } from "@/types/roles";
import { formatDate, initials, cn } from "@/lib/utils";

interface Row {
  id: string;
  name: string;
  email: string;
  region: string | null;
  university: string | null;
  createdAt: string;
  roles: UserRole[];
}

const roleTone: Record<UserRole, "brand" | "gold" | "seed" | "neutral" | "danger"> = {
  estudiante: "neutral",
  docente: "seed",
  institucion: "brand",
  mentor: "gold",
  speaker: "brand",
  admin: "danger",
  super_admin: "danger",
};

export function UserTable({
  users,
  isSuperAdmin,
  currentUserId,
}: {
  users: Row[];
  isSuperAdmin: boolean;
  currentUserId: string;
}) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<UserRole | "todos">("todos");
  const [busy, setBusy] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<{ text: string; ok: boolean } | null>(null);
  const [editing, setEditing] = React.useState<Row | null>(null);

  React.useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(t);
  }, [feedback]);

  const visible = users.filter((u) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.region ?? "").toLowerCase().includes(q);
    const matchesRole = filter === "todos" || u.roles.includes(filter);
    return matchesQuery && matchesRole;
  });

  async function toggleRole(user: Row, role: UserRole, has: boolean) {
    setBusy(`${user.id}:${role}`);
    const result = has
      ? await revokeRoleAction(user.id, role)
      : await grantRoleAction(user.id, role);
    setBusy(null);

    setFeedback({ text: result.ok ? (result.message ?? "Listo.") : result.error, ok: result.ok });

    if (result.ok) {
      setEditing((prev) =>
        prev && prev.id === user.id
          ? {
              ...prev,
              roles: has ? prev.roles.filter((r) => r !== role) : [...prev.roles, role],
            }
          : prev,
      );
      router.refresh();
    }
  }

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

      {/* Filtros */}
      <div className="mb-5 space-y-3">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-mist" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, correo o región…"
            className="pl-10"
            aria-label="Buscar usuarios"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setFilter("todos")}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              filter === "todos"
                ? "bg-sep-600 text-white"
                : "bg-white text-graphite ring-1 ring-inset ring-line hover:bg-surface-2",
            )}
          >
            Todos <span className="tabular ml-1 opacity-70">{users.length}</span>
          </button>
          {USER_ROLES.map((r) => {
            const count = users.filter((u) => u.roles.includes(r)).length;
            if (count === 0) return null;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setFilter(r)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  filter === r
                    ? "bg-sep-600 text-white"
                    : "bg-white text-graphite ring-1 ring-inset ring-line hover:bg-surface-2",
                )}
              >
                {ROLE_META[r].shortLabel}
                <span className="tabular ml-1 opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={<Search className="size-5" />}
          title="Sin resultados"
          description="Prueba con otro término o quita los filtros."
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead className="border-b border-line bg-surface-1">
                <tr>
                  {["Usuario", "Región", "Roles", "Registro", ""].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-ui"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {visible.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-1">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full sep-gradient text-[0.625rem] font-semibold text-white">
                          {initials(u.name || u.email)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-ink">
                            {u.name || "—"}
                          </p>
                          <p className="truncate text-xs text-slate-ui">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-graphite">
                      {u.region ?? "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {u.roles.length === 0 ? (
                          <span className="text-xs text-mist">Sin rol</span>
                        ) : (
                          u.roles.map((r) => (
                            <Badge key={r} tone={roleTone[r]}>
                              {ROLE_META[r].shortLabel}
                            </Badge>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-ui">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setEditing(u)}
                        disabled={u.id === currentUserId}
                        title={
                          u.id === currentUserId
                            ? "No puedes modificar tus propios roles"
                            : "Gestionar roles"
                        }
                        className="rounded-[8px] border border-line px-3 py-1.5 text-xs font-medium text-graphite transition-colors hover:bg-surface-2 disabled:opacity-40"
                      >
                        Gestionar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modal de roles */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-5 backdrop-blur-sm"
          onClick={() => setEditing(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Roles de ${editing.name}`}
        >
          <div
            className="w-full max-w-md rounded-[16px] bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
              <div>
                <p className="font-display text-[1.0625rem] font-semibold text-ink">
                  {editing.name}
                </p>
                <p className="text-xs text-slate-ui">{editing.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-lg p-1.5 text-slate-ui hover:bg-surface-2"
                aria-label="Cerrar"
              >
                <X className="size-4" />
              </button>
            </div>

            <ul className="divide-y divide-line">
              {USER_ROLES.map((role) => {
                const has = editing.roles.includes(role);
                const restricted = role === "admin" || role === "super_admin";
                const locked = restricted && !isSuperAdmin;
                const key = `${editing.id}:${role}`;

                return (
                  <li key={role} className="flex items-center gap-3 px-5 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1.5 text-sm font-medium text-ink">
                        {ROLE_META[role].label}
                        {restricted && (
                          <ShieldCheck className="size-3.5 text-danger" />
                        )}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-ui">
                        {ROLE_META[role].description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleRole(editing, role, has)}
                      disabled={locked || busy === key}
                      title={locked ? "Solo un super administrador puede hacerlo" : undefined}
                      className={cn(
                        "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[8px] px-3 text-xs font-medium transition-colors disabled:opacity-40",
                        has
                          ? "border border-danger/30 text-danger hover:bg-danger-bg"
                          : "bg-sep-600 text-white hover:bg-sep-700",
                      )}
                    >
                      {busy === key && <Loader2 className="size-3.5 animate-spin" />}
                      {has ? "Revocar" : "Otorgar"}
                    </button>
                  </li>
                );
              })}
            </ul>

            <p className="border-t border-line bg-surface-1 px-5 py-3 text-xs leading-relaxed text-slate-ui">
              Cada cambio queda registrado en el log de auditoría con tu identidad, IP y
              marca de tiempo.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
