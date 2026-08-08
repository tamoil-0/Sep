import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { Card, Container, Section, SectionHeader } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Escríbenos por WhatsApp, correo o redes. Respondemos personas, no bots.",
};

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
    <Section>
      <Container size="wide">
        <SectionHeader
          eyebrow="Contacto"
          title="Hablemos"
          description="No hay formularios que caen en un vacío. Del otro lado hay un equipo de nueve personas y doce voluntarios."
          align="center"
        />

        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
          {channels.map((c) => (
            <Card key={c.label} className="flex flex-col p-6 text-center">
              <c.icon className="mx-auto size-5 text-sep-600" />
              <p className="mt-4 text-xs uppercase tracking-[0.1em] text-slate-ui">
                {c.label}
              </p>
              {c.href ? (
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="mt-1.5 break-words text-[0.9375rem] font-medium text-ink hover:text-sep-600"
                >
                  {c.value}
                </a>
              ) : (
                <p className="mt-1.5 text-[0.9375rem] font-medium text-ink">{c.value}</p>
              )}
              <p className="mt-2.5 flex-1 text-xs leading-relaxed text-slate-ui">
                {c.detail}
              </p>
            </Card>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.12em] text-slate-ui">
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
            <p className="text-sm leading-relaxed text-slate-ui">
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
