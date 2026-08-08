import type { NextConfig } from "next";

/** Cabeceras de seguridad — Plan Maestro §9.4 */
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://*.supabase.co https://checkout.culqi.com https://js.hcaptcha.com https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.supabase.co",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.culqi.com https://hcaptcha.com https://*.hcaptcha.com",
      "frame-src https://checkout.culqi.com https://hcaptcha.com https://*.hcaptcha.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  // Rutas heredadas de la web actual en Vercel → nueva estructura
  async redirects() {
    return [
      { source: "/register", destination: "/registro", permanent: true },
      { source: "/preguntas_respuestas", destination: "/faq", permanent: true },
    ];
  },
};

export default nextConfig;
