import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/roles";
import { roleHome } from "@/types/roles";

export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  region: string | null;
  roles: UserRole[];
  onboardingDone: boolean;
}

/**
 * Usuario autenticado con sus roles. Memoizado por request con `cache()`,
 * así varios Server Components pueden llamarlo sin multiplicar consultas.
 *
 * Usa `getUser()` (no `getSession()`): valida el JWT contra el servidor de
 * Supabase en lugar de confiar en la cookie.
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  const [{ data: profile }, { data: roleRows }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, avatar_url, region, onboarding_done")
      .eq("id", user.id)
      .single(),
    supabase.from("user_roles").select("role").eq("user_id", user.id).is("revoked_at", null),
  ]);

  return {
    id: user.id,
    email: user.email ?? "",
    fullName: profile?.full_name ?? user.email?.split("@")[0] ?? "",
    avatarUrl: profile?.avatar_url ?? null,
    region: profile?.region ?? null,
    roles: (roleRows?.map((r) => r.role) ?? ["estudiante"]) as UserRole[],
    onboardingDone: profile?.onboarding_done ?? false,
  };
});

/** Exige sesión. Redirige a login conservando el destino. */
export async function requireUser(returnTo?: string): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    const next = returnTo ? `?next=${encodeURIComponent(returnTo)}` : "";
    redirect(`/login${next}`);
  }
  return user;
}

/**
 * Exige uno de los roles indicados. Segunda capa de defensa (§9.2):
 * el `proxy.ts` ya filtró la ruta, pero cada página revalida en el servidor.
 */
export async function requireRole(allowed: UserRole[]): Promise<SessionUser> {
  const user = await requireUser();
  const ok = user.roles.some((r) => allowed.includes(r));
  if (!ok) redirect(roleHome(user.roles));
  return user;
}
