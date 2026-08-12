import type { Metadata } from "next";
import { PenLine } from "lucide-react";
import {
  Container,
  EmptyState,
  Section,
  SectionHeader,
} from "@/components/ui/primitives";
import { getPublishedPosts } from "@/server/queries/public-content";
import { RealPhoto, SEP_PHOTOS } from "@/components/marketing/real-photo";
import { NewsCard } from "@/components/marketing/news-card";

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
            <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <li key={post.id}>
                  <NewsCard
                    post={post}
                    fallbackImage={
                      [SEP_PHOTOS.alliance, SEP_PHOTOS.methodology, SEP_PHOTOS.workshop][
                        index % 3
                      ]
                    }
                    priority={index < 3}
                  />
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>
    </>
  );
}
