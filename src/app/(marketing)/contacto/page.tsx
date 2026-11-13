import { createPageMetadata } from "@/lib/seo";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { Card, Container, Section, SectionHeader } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export const metadata = createPageMetadata({
  title: "Contacto",
  description:
    "Escríbenos por WhatsApp, correo o redes. Respondemos personas, no bots.",
  path: "/contacto",
  keywords: ["contacto SEP Perú", "Semillero de Emprendedores contacto"],
});

const channels = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: siteConfig.contact.whatsappDisplay,
    href: siteConfig.contact.whatsappUrl,
    detail: "La vía más rápida. Solemos responder el mismo día.",
  },
  {
    icon: Mail,
    label: "Correo",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
    detail: "Para alianzas, prensa y temas formales.",
  },
  {
    icon: MapPin,
    label: "Dónde estamos",
    value: "Casma, Áncash · Perú",
    detail: "Operamos 100 % en línea desde toda la costa, sierra y selva.",
  },
];

const shortcuts = [
  { label: "Quiero ser voluntario", href: "/voluntariado" },
  { label: "Quiero inscribir mi colegio", href: "/colegios" },
  { label: "Quiero ser speaker", href: "/speakers" },
  { label: "Represento una empresa", href: "/empresas" },
  { label: "Quiero donar", href: "/donaciones" },
  { label: "Tengo una duda", href: "/faq" },
];

export default function ContactoPage() {
  return (
    <Section tone="night">
      <Container size="wide">
        <SectionHeader
          as="h1"
          eyebrow="Contacto"
          title="Hablemos"
          description="No hay formularios que caen en un vacío. Del otro lado hay un equipo de nueve personas y doce voluntarios."
          align="center"
        />

        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
          {channels.map((c) => (
            <Card
              key={c.label}
              interactive={Boolean(c.href)}
              className="relative flex flex-col p-6 text-center"
            >
              <c.icon className="mx-auto size-5 text-sep-600" />
              <p className="mt-4 text-caption font-medium tracking-eyebrow text-slate-ui">
                {c.label}
              </p>
              {c.href ? (
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="mt-1.5 break-words text-body-sm font-medium text-ink after:absolute after:inset-0 after:content-[''] hover:text-sep-600"
                >
                  {c.value}
                </a>
              ) : (
                <p className="mt-1.5 text-body-sm font-medium text-ink">{c.value}</p>
              )}
              <p className="mt-2.5 flex-1 text-caption leading-relaxed text-slate-ui">
                {c.detail}
              </p>
            </Card>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <p className="text-center text-body-sm font-semibold tracking-eyebrow text-slate-ui">
            ¿Qué te trae por aquí?
          </p>
          <ul className="mt-5 flex flex-wrap justify-center gap-2.5">
            {shortcuts.map((s) => (
              <li key={s.href}>
                <Button href={s.href} variant="outline" size="sm">
                  {s.label}
                </Button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto mt-12 max-w-2xl">
          <Card className="text-center">
            <p className="text-body-sm leading-relaxed text-slate-ui">
              También estamos en{" "}
              {[
                ["Instagram", siteConfig.social.instagram],
                ["Facebook", siteConfig.social.facebook],
                ["TikTok", siteConfig.social.tiktok],
                ["LinkedIn", siteConfig.social.linkedin],
              ].map(([label, href], i, arr) => (
                <span key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-sep-600 hover:underline"
                  >
                    {label}
                  </a>
                  {i < arr.length - 1 ? ", " : "."}
                </span>
              ))}
            </p>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
