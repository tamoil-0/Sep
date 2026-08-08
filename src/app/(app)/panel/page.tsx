import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { roleHome } from "@/types/roles";

/** Punto de entrada único: redirige a cada quien a su panel (§5.2). */
export default async function PanelRedirect() {
  const user = await requireUser();
  redirect(roleHome(user.roles));
}
