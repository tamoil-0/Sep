import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { AdminList } from "@/components/app/admin-list";
import { ADMIN_VIEWS } from "../_registry";

const view = ADMIN_VIEWS.newsletter;

export const metadata: Metadata = { title: view.title };

export default async function Page() {
  await requireRole(["admin", "super_admin"]);
  return <AdminList view={view} />;
}
