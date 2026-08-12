import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge, Card } from "@/components/ui/primitives";
import { formatDate } from "@/lib/utils";

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
}: {
  post: NewsCardPost;
  fallbackImage: string;
  priority?: boolean;
}) {
  const category = post.tags[0] ?? "Actualidad SEP";

  return (
    <Card as="article" interactive className="group flex h-full flex-col overflow-hidden p-3 sm:p-4">
      <Link
        href={`/blog/${post.slug}`}
        className="relative block aspect-[16/9] overflow-hidden rounded-[11px] bg-surface-2"
        aria-label={`Leer ${post.title}`}
      >
        <Image
          src={post.cover_url ?? fallbackImage}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 48vw, 92vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-sep-950/20 to-transparent" />
      </Link>

      <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
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

        <h3 className="mt-3 font-display text-[1.125rem] font-semibold leading-snug text-ink">
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
