import type { Metadata } from "next";
import Link from "next/link";
import { Bell, KeyRound, Mail, MapPin, ShieldCheck } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/page-header";
import { Badge, Card } from "@/components/ui/primitives";
import { PanelSection } from "@/components/app/data-views";
import { ROLE_META } from "@/types/roles";
import { formatDate, initials } from "@/lib/utils";
import { ProfileForm } from "./profile-form";

export const metadata: Metadata = {
  title: "Mi cuenta",
  robots: { index: false, follow: false },
};

export default async function CuentaPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "full_name, email, phone, region, province, university, career, current_situation, bio, interests, created_at, newsletter_opt_in",
    )
    .eq("id", user.id)
    .maybeSingle();

  const { count: unread } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .is("read_at", null);

  return (
    <>
      <PageHeader
        title="Mi cuenta"
        description="Tus datos y cómo te ve el resto de la comunidad."
      />

      {/* Identidad */}
      <Card className="overflow-hidden p-0">
        <div className="sep-gradient px-7 py-7">
          <div className="flex flex-wrap items-center gap-5">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-gold-500 font-display text-lg font-semibold text-ink">
              {initials(profile?.full_name || user.email)}
            </span>
            <div className="min-w-0">
              <h2 className="font-display text-[1.5rem] font-semibold text-white">
                {profile?.full_name || "Sin nombre"}
              </h2>
              <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/70">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="size-3.5" />
                  {user.email}
                </span>
                {profile?.region && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-3.5" />
                    {profile.region}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {user.roles.map((r) => (
              <Badge key={r} tone="white">
                {ROLE_META[r].shortLabel}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-2 px-7 py-4 text-xs text-slate-ui">
          <span>
            Miembro desde {profile?.created_at ? formatDate(profile.created_at) : "—"}
          </span>
          <span>
            Newsletter: {profile?.newsletter_opt_in ? "activo" : "desactivado"}
          </span>
        </div>
      </Card>

      {/* Accesos */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Card
          interactive
          className="flex items-center gap-4 p-5"
          as={Link}
          {...{ href: "/cuenta/seguridad" }}
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-sep-50 text-sep-600">
            <ShieldCheck className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-[0.9375rem] font-medium text-ink">Seguridad</p>
            <p className="mt-0.5 text-xs text-slate-ui">
              Contraseña, doble factor y sesiones
            </p>
          </div>
        </Card>

        <Card
          interactive
          className="flex items-center gap-4 p-5"
          as={Link}
          {...{ href: "/cuenta/notificaciones" }}
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-gold-500/15 text-gold-700">
            <Bell className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[0.9375rem] font-medium text-ink">Notificaciones</p>
            <p className="mt-0.5 text-xs text-slate-ui">
              {unread ? `${unread} sin leer` : "Todo al día"}
            </p>
          </div>
          {unread ? <Badge tone="danger">{unread}</Badge> : null}
        </Card>
      </div>

      {/* Perfil editable */}
      <PanelSection title="Mis datos">
        <Card>
          <ProfileForm
            defaults={{
              fullName: profile?.full_name ?? "",
              phone: profile?.phone ?? "",
              region: profile?.region ?? "",
              province: profile?.province ?? "",
              university: profile?.university ?? "",
              career: profile?.career ?? "",
              currentSituation: profile?.current_situation ?? "",
              bio: profile?.bio ?? "",
              interests: profile?.interests ?? [],
              newsletter: profile?.newsletter_opt_in ?? false,
            }}
          />
        </Card>
      </PanelSection>

      {/* Derechos ARCO */}
      <PanelSection title="Tus datos personales">
        <Card>
          <div className="flex items-start gap-3.5">
            <KeyRound className="mt-0.5 size-5 shrink-0 text-slate-ui" />
            <div>
              <h3 className="font-display text-[0.9375rem] font-semibold text-ink">
                Acceso, rectificación, cancelación y oposición
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-ui">
                Conforme a la Ley N.º 29733 puedes pedirnos una copia de tus datos,
                corregirlos, cancelarlos u oponerte a su tratamiento. Escríbenos a{" "}
                <a
                  href="mailto:semilleroemprendedorperu@gmail.com?subject=Derechos%20ARCO"
                  className="font-medium text-sep-600 hover:underline"
                >
                  semilleroemprendedorperu@gmail.com
                </a>{" "}
                y respondemos en un máximo de 20 días hábiles.
              </p>
            </div>
          </div>
        </Card>
      </PanelSection>
    </>
  );
}
