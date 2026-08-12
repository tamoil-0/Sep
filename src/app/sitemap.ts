import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { courses } from "@/config/courses";
import { volunteerRoles } from "@/config/volunteering";
import { getPublishedPosts } from "@/server/queries/public-content";

const SITE_UPDATED_AT = new Date("2026-08-12T00:00:00-05:00");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const posts = await getPublishedPosts().catch(() => []);

  const staticRoutes = [
    { path: "", priority: 1 },
    { path: "/cursos", priority: 0.9 },
    { path: "/silp", priority: 0.9 },
    { path: "/precios", priority: 0.9 },
    { path: "/voluntariado", priority: 0.8 },
    { path: "/colegios", priority: 0.8 },
    { path: "/docentes", priority: 0.8 },
    { path: "/empresas", priority: 0.8 },
    { path: "/speakers", priority: 0.7 },
    { path: "/nosotros", priority: 0.7 },
    { path: "/conocenos", priority: 0.7 },
    { path: "/eventos", priority: 0.6 },
    { path: "/convocatorias", priority: 0.6 },
    { path: "/blog", priority: 0.6 },
    { path: "/testimonios", priority: 0.5 },
    { path: "/donaciones", priority: 0.5 },
    { path: "/faq", priority: 0.5 },
    { path: "/contacto", priority: 0.5 },
    { path: "/verificar", priority: 0.4 },
    { path: "/legal/terminos", priority: 0.2 },
    { path: "/legal/privacidad", priority: 0.2 },
    { path: "/legal/cookies", priority: 0.2 },
  ];

  return [
    ...staticRoutes.map((r) => ({
      url: `${base}${r.path}`,
      lastModified: SITE_UPDATED_AT,
      changeFrequency: "weekly" as const,
      priority: r.priority,
    })),
    ...courses.map((c) => ({
      url: `${base}/cursos/${c.slug}`,
      lastModified: SITE_UPDATED_AT,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...volunteerRoles.map((r) => ({
      url: `${base}/voluntariado/${r.slug}`,
      lastModified: SITE_UPDATED_AT,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...posts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: post.published_at ? new Date(post.published_at) : SITE_UPDATED_AT,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
