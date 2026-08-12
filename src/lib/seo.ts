import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

type PageMetadataInput = {
  title: string;
  description: string;
  path: `/${string}` | "/";
  keywords?: string[];
  absoluteTitle?: boolean;
  type?: "website" | "article";
};

const socialImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${siteConfig.shortName} · ${siteConfig.name}`,
};

/** Metadatos consistentes para cada URL pública e indexable. */
export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
  absoluteTitle = false,
  type = "website",
}: PageMetadataInput): Metadata {
  const socialTitle = absoluteTitle ? title : `${title} | ${siteConfig.shortName}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: "es_PE",
      url: path,
      siteName: siteConfig.name,
      title: socialTitle,
      description,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [socialImage.url],
    },
  };
}

/** Evita que contenido de la BD pueda cerrar el script JSON-LD. */
export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

