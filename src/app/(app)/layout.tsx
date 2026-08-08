import { AppSidebar } from "@/components/app/app-sidebar";
import { requireUser } from "@/lib/auth/session";
import { primaryRole } from "@/types/roles";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const active = primaryRole(user.roles);

  return (
    <div className="flex min-h-screen bg-surface-1">
      <AppSidebar
        activeRole={active}
        roles={user.roles}
        fullName={user.fullName}
        email={user.email}
      />
      <div className="min-w-0 flex-1">
        <main id="contenido" className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
