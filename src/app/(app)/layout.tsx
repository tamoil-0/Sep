import { AppSidebar } from "@/components/app/app-sidebar";
import { requireUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { primaryRole } from "@/types/roles";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  if (!user.onboardingDone) redirect("/onboarding");
  const active = primaryRole(user.roles);

  return (
    <div className="min-h-dvh bg-surface-1 lg:flex">
      <AppSidebar
        activeRole={active}
        roles={user.roles}
        fullName={user.fullName}
        email={user.email}
      />
      <div className="min-w-0 flex-1">
        <main
          id="contenido"
          className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 xl:px-8 xl:py-10"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
