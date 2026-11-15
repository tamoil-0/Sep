import type { Metadata, Viewport } from "next";
import { Geist, Sora } from "next/font/google";
import { siteConfig } from "@/config/site";
import { ToastProvider } from "@/components/ui/toast";
import { RevealObserver } from "@/components/ui/reveal-observer";
import "./globals.css";

// Cuerpo y UI: Geist, sobria y técnica. Títulos: Sora, geométrica y de aire futurista.
// Solo `latin`: cubre todo el español (á, é, ñ, ¿, ¡). Precargar también
// `latin-ext` sumaba 2 archivos (~45 KB) antes del primer pintado.
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.seo.title,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.seo.description,
  applicationName: siteConfig.shortName,
  icons: {
    icon: [{ url: "/icon.png", type: "image/png", sizes: "64x64" }],
    shortcut: "/icon.png",
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
  keywords: [...siteConfig.seo.keywords],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "education",
  classification: "Educación, emprendimiento e innovación social",
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      "ASPpML06eHafXbHbnTxObZ6R-pE9dkDgyxwTCjtIRfA",
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es-PE"
      data-scroll-behavior="smooth"
      className={`${geist.variable} ${sora.variable}`}
    >
      <body className="antialiased">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-violeta-600 focus:px-4 focus:py-2 focus:text-body-sm focus:font-medium focus:text-white"
        >
          Saltar al contenido
        </a>
        <ToastProvider>{children}</ToastProvider>
        <RevealObserver />
      </body>
    </html>
  );
}
