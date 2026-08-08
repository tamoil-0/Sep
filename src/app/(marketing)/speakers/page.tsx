import type { Metadata } from "next";
import { Globe, Mic, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  Badge,
  Card,
  Container,
  GoldUnderline,
  Section,
  SectionHeader,
} from "@/components/ui/primitives";
import { speakerBenefits } from "@/config/volunteering";
import { initials } from "@/lib/utils";
import { SpeakerForm } from "./speaker-form";

export const metadata: Metadata = {
  title: "Red de speakers",
  description:
    "¿Eres especialista en metodologías ágiles o innovación social? Únete a la red de speakers de SEP e inspira a jóvenes de 10+ regiones del Perú.",
};

export default async function SpeakersPage() {
  const supabase = await createClient();

  const { data: speakers } = await supabase
    .from("speaker_profiles")
    .select("id, full_name, expertise, topics, story, region, country")
    .eq("is_public", true)
    .eq("is_approved", true)
    .limit(9);

  const { count } = await supabase
    .from("speaker_profiles")
    .select("id", { count: "exact", head: true })
    .eq("is_approved", true);

  return (
    <>
      <section className="border-b border-line bg-surface-1">
        <Container size="wide" className="py-16 sm:py-20">
          <div className="max-w-2xl">
            <Badge tone="brand">{count ?? 0} speakers en la red</Badge>
            <h1 className="mt-5 font-display text-[2.5rem] font-bold leading-[1.08] text-ink sm:text-[3.25rem]">
              ¿Tienes algo que <GoldUnderline>contar</GoldUnderline>?
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-ui">
              ¿Eres especialista en metodologías ágiles, innovación social o un referente
              en tu campo? Únete a nuestra base de speakers e inspira a más jóvenes desde
              tu región y tu historia.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Mic,
                title: "Especialistas en metodologías",
                body: "Design Thinking, Scrum, Lean, Kanban, OKRs y más.",
              },
              {
                icon: Users,
                title: "Referentes de impacto social",
                body: "Líderes cuya historia demuestra el poder de la innovación social.",
              },
              {
                icon: Globe,
                title: "Voces de toda Latam",
                body: "Desde cualquier región del Perú o país de América Latina.",
              },
            ].map((c) => (
              <Card key={c.title} className="p-6">
                <c.icon className="size-5 text-sep-600" />
                <h2 className="mt-4 font-display text-[0.9375rem] font-semibold text-ink">
                  {c.title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-ui">{c.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <Section>
        <Container size="wide">
          <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
            <div>
              {(speakers?.length ?? 0) > 0 && (
                <>
                  <SectionHeader
                    eyebrow="La red"
                    title="Speakers recientes"
                    description="Personas que ya están compartiendo su historia con la comunidad SEP."
                  />

                  <ul className="mt-10 grid gap-4 sm:grid-cols-2">
                    {(speakers ?? []).map((s) => (
                      <li key={s.id}>
                        <Card className="flex h-full flex-col p-5">
                          <div className="flex items-center gap-3">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-full sep-gradient text-xs font-semibold text-white">
                              {initials(s.full_name)}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-ink">
                                {s.full_name}
                              </p>
                              <p className="truncate text-xs text-slate-ui">
                                {[s.region, s.country === "PE" ? "Perú" : s.country]
                                  .filter(Boolean)
                                  .join(", ")}
                              </p>
                            </div>
                          </div>

                          {s.expertise && (
                            <p className="mt-3 text-xs font-medium text-sep-600">
                              {s.expertise}
                            </p>
                          )}

                          {s.story && (
                            <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-ui">
                              “{s.story}”
                            </p>
                          )}

                          {s.topics?.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-1.5">
                              {s.topics.slice(0, 3).map((t) => (
                                <Badge key={t} tone="neutral">
                                  {t}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </Card>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <div className="mt-12">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
                  ¿Qué ganas al unirte?
                </p>
                <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                  {speakerBenefits.map((b) => (
                    <li key={b.title} className="rounded-[12px] border border-line p-5">
                      <p className="text-[0.9375rem] font-medium text-ink">{b.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-ui">
                        {b.detail}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Card className="lg:sticky lg:top-24 lg:self-start">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-[1.25rem] font-semibold text-ink">
                  Únete a la red
                </h2>
                <Badge tone="seed">Gratuito</Badge>
              </div>
              <p className="mt-1.5 text-sm text-slate-ui">
                Cuéntanos tu historia. Revisamos cada perfil.
              </p>

              <div className="mt-6">
                <SpeakerForm />
              </div>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
