import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/auth/",
          "/registro",
          "/onboarding",
          "/apoya-hoy",
          "/panel",
          "/estudiante",
          "/docente",
          "/mentor",
          "/institucion",
          "/speaker",
          "/admin",
          "/cuenta",
          "/login",
          "/recuperar",
          "/verificar/",
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
