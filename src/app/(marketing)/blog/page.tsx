import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, PenLine } from "lucide-react";
import {
  Badge,
  Card,
  Container,
  EmptyState,
  Section,
  SectionHeader,
} from "@/components/ui/primitives";
import { formatDate } from "@/lib/utils";
import { getPublishedPosts } from "@/server/queries/public-content";
import { RealPhoto, SEP_PHOTOS } from "@/components/marketing/real-photo";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Aprendizajes, metodologías y crónicas del ecosistema de innovación social en regiones del Perú.",
};

/** ISR: la página se sirve estática y se regenera cada 5 min. */
export const revalidate = 300;

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <section className="border-b border-line bg-surface-1">
        <Container size="wide" className="py-14 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.86fr]">
          <SectionHeader
            eyebrow="Blog"
            title="Lo que vamos aprendiendo"
            description="Metodologías, crónicas de campo y decisiones que tomamos en voz alta."
          />
          <RealPhoto
            src={SEP_PHOTOS.methodology}
            alt="Equipo de jóvenes analizando ideas durante una sesión de SEP"
            priority
            label="Conocimiento construido en equipo"
            className="aspect-[16/10] min-h-0"
          />
          </div>
        </Container>
      </section>

      <Section>
        <Container size="wide">
          {!posts.length ? (
            <EmptyState
              icon={<PenLine className="size-5" />}
              title="Todavía no hay publicaciones"
              description="Estamos escribiendo las primeras. Suscríbete al newsletter para enterarte."
            />
          ) : (
            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => {
                const author = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles;
                return (
                  <li key={p.id}>
                    <Card
                      interactive
                      className="flex h-full flex-col p-6"
                      as={Link}
                      {...{ href: `/blog/${p.slug}` }}
                    >
                      {p.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {p.tags.slice(0, 2).map((t) => (
                            <Badge key={t} tone="neutral">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <h2 className="mt-3.5 font-display text-[1.125rem] font-semibold leading-snug text-ink">
                        {p.title}
                      </h2>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-ui">
                        {p.excerpt}
                      </p>

                      <p className="mt-5 flex items-center justify-between border-t border-line pt-3.5 text-xs text-slate-ui">
                        <span>
                          {author?.full_name ?? "Equipo SEP"}
                          {p.published_at && ` · ${formatDate(p.published_at)}`}
                        </span>
                        <ArrowRight className="size-3.5 text-sep-600" />
                      </p>
                    </Card>
                  </li>
                );
              })}
            </ul>
          )}
        </Container>
      </Section>
    </>
  );
}
