import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Sprout } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { primaryRole, ROLE_META } from "@/types/roles";
import { OnboardingForm } from "./onboarding-form";

export const metadata: Metadata = {
  title: "Completa tu perfil",
  robots: { index: false, follow: false },
};

/**
 * Respaldo exclusivo para cuentas antiguas o perfiles realmente incompletos.
 * El flujo de registro actual guarda el perfil completo y entra al panel tras
 * confirmar el correo, por lo que una cuenta nueva nunca repite estos campos.
 */
export default async function OnboardingPage() {
  const user = await requireUser();

  if (user.onboardingDone) {
    redirect(ROLE_META[primaryRole(user.roles)].home);
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, region, university, career, current_situation, interests")
    .eq("id", user.id)
    .maybeSingle();

  const role = primaryRole(user.roles);

  return (
    <div className="mx-auto max-w-lg py-6">
      <div className="text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-[16px] sep-gradient text-white">
          <Sprout className="size-7" />
        </span>
        <h1 className="mt-6 font-display text-[2rem] font-semibold leading-tight text-ink">
          ¡Bienvenid@ a SEP{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}!
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-slate-ui">
          Encontramos una cuenta anterior con información pendiente. Completa únicamente
          estos datos y entrarás a tu panel.
        </p>
      </div>

      <div className="mt-8">
        <OnboardingForm
          role={role}
          defaults={{
            region: profile?.region ?? "",
            university: profile?.university ?? "",
            career: profile?.career ?? "",
            currentSituation: profile?.current_situation ?? "",
            interests: profile?.interests ?? [],
          }}
        />
      </div>
    </div>
  );
}
