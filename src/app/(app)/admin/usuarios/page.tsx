import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/page-header";
import { UserTable } from "./user-table";
import type { UserRole } from "@/types/roles";

export const metadata: Metadata = { title: "Usuarios y roles" };

export default async function AdminUsuariosPage() {
  const admin = await requireRole(["admin", "super_admin"]);
  const supabase = await createClient();

  const [{ data: profiles }, { data: roles }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, email, region, university, created_at, onboarding_done")
      .order("created_at", { ascending: false })
      .limit(300),
    supabase.from("user_roles").select("user_id, role").is("revoked_at", null),
  ]);

  const rolesByUser = new Map<string, UserRole[]>();
  for (const r of roles ?? []) {
    const list = rolesByUser.get(r.user_id) ?? [];
    list.push(r.role);
    rolesByUser.set(r.user_id, list);
  }

  return (
    <>
      <PageHeader
        title="Usuarios y roles"
        description="Un usuario acumula roles. Solo un super administrador otorga admin o super admin."
      />

      <UserTable
        isSuperAdmin={admin.roles.includes("super_admin")}
        currentUserId={admin.id}
        users={(profiles ?? []).map((p) => ({
          id: p.id,
          name: p.full_name,
          email: p.email,
          region: p.region,
          university: p.university,
          createdAt: p.created_at,
          roles: rolesByUser.get(p.id) ?? [],
        }))}
      />
    </>
  );
}
