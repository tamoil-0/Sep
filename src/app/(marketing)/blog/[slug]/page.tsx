import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge, Container, Section } from "@/components/ui/primitives";
import { formatDate } from "@/lib/utils";
import { createPageMetadata, serializeJsonLd } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!data) return { title: "Artículo no encontrado", robots: { index: false } };
  return createPageMetadata({
    title: data.title,
    description: data.excerpt ?? `Artículo de ${siteConfig.name} sobre emprendimiento e innovación.`,
    path: `/blog/${slug}`,
    type: "article",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, excerpt, content_mdx, tags, published_at, profiles(full_name)")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!post) notFound();

  const author = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
  const paragraphs = (post.content_mdx ?? "").split("\n\n").filter(Boolean);

  return (
    <Section>
      <Container size="narrow">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-slate-ui transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" />
          Todos los artículos
        </Link>

        <article className="mt-8">
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((t) => (
                <Badge key={t} tone="neutral">
                  {t}
                </Badge>
              ))}
            </div>
          )}

          <h1 className="mt-4 font-display text-[2.25rem] font-bold leading-[1.15] text-ink">
            {post.title}
          </h1>

          <p className="mt-4 text-sm text-slate-ui">
            {author?.full_name ?? "Equipo SEP"}
            {post.published_at && ` · ${formatDate(post.published_at)}`}
          </p>

          {post.excerpt && (
            <p className="mt-7 border-l-2 border-gold-500 pl-5 text-lg leading-relaxed text-graphite">
              {post.excerpt}
            </p>
          )}

          <div className="mt-9 space-y-5">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-[1.0625rem] leading-relaxed text-graphite">
                {p}
              </p>
            ))}
          </div>
        </article>
      </Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.published_at,
            inLanguage: "es-PE",
            mainEntityOfPage: `${siteConfig.url}/blog/${slug}`,
            author: {
              "@type": "Person",
              name: author?.full_name ?? "Equipo SEP",
            },
            publisher: {
              "@type": "EducationalOrganization",
              "@id": `${siteConfig.url}/#organization`,
              name: siteConfig.name,
              logo: {
                "@type": "ImageObject",
                url: `${siteConfig.url}/img/new_images/logo_original.png`,
              },
            },
          }),
        }}
      />
    </Section>
  );
}
