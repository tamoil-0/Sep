import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge, Card } from "@/components/ui/primitives";
import { cn, formatDate } from "@/lib/utils";

export type NewsCardPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  tags: string[];
  published_at: string | null;
};

export function NewsCard({
  post,
  fallbackImage,
  priority = false,
  variant = "default",
}: {
  post: NewsCardPost;
  fallbackImage: string;
  priority?: boolean;
  variant?: "default" | "featured";
}) {
  const category = post.tags[0] ?? "Actualidad SEP";
  const featured = variant === "featured";

  return (
    <Card
      as="article"
      interactive
      className={cn(
        "group h-full overflow-hidden p-3 sm:p-4",
        featured ? "grid gap-2 md:grid-cols-[1.25fr_0.75fr]" : "flex flex-col",
      )}
    >
      <Link
        href={`/blog/${post.slug}`}
        className={cn(
          "relative block overflow-hidden rounded-[11px] bg-surface-2",
          featured ? "aspect-[16/10] md:aspect-auto md:min-h-[320px]" : "aspect-[16/9]",
        )}
        aria-label={`Leer ${post.title}`}
      >
        <Image
          src={post.cover_url ?? fallbackImage}
          alt=""
          fill
          priority={priority}
          sizes={
            featured
              ? "(min-width: 1024px) 60vw, (min-width: 768px) 55vw, 92vw"
              : "(min-width: 1024px) 30vw, (min-width: 640px) 48vw, 92vw"
          }
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-sep-950/20 to-transparent" />
      </Link>

      <div className={cn("flex flex-1 flex-col px-1 pb-1 pt-4", featured && "md:p-6")}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge tone="brand" className="capitalize">
            {category}
          </Badge>
          {post.published_at && (
            <time dateTime={post.published_at} className="text-xs text-slate-ui">
              {formatDate(post.published_at)}
            </time>
          )}
        </div>

        <h3
          className={cn(
            "mt-3 font-display font-semibold leading-snug text-ink",
            featured ? "text-[1.5rem] md:text-[1.75rem]" : "text-[1.125rem]",
          )}
        >
          <Link href={`/blog/${post.slug}`} className="hover:text-sep-700">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-ui">
            {post.excerpt}
          </p>
        )}

        <Link
          href={`/blog/${post.slug}`}
          className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-sep-600 hover:text-sep-800 hover:underline"
        >
          Ver noticia
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </Card>
  );
}
