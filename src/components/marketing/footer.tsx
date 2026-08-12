import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/primitives";
import { footerNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";

const socials = [
  { label: "Facebook", href: siteConfig.social.facebook },
  { label: "Instagram", href: siteConfig.social.instagram },
  { label: "TikTok", href: siteConfig.social.tiktok },
  { label: "LinkedIn", href: siteConfig.social.linkedin },
];

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <Container size="wide" className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2.7fr]">
          {/* Marca */}
          <div>
            <Logo className="h-14" variant="white" />

            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
              Democratizamos metodologías ágiles para jóvenes de todas las regiones del Perú.
              Nacimos en Casma, Áncash, en abril de 2024.
            </p>

            <div className="mt-6 space-y-2.5 text-sm">
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center gap-2.5 text-white/70 transition-colors hover:text-gold-500"
              >
                <Mail className="size-4 shrink-0" />
                <span className="break-all">{siteConfig.contact.email}</span>
              </a>
              <a
                href={siteConfig.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-white/70 transition-colors hover:text-gold-500"
              >
                <MessageCircle className="size-4 shrink-0" />
                {siteConfig.contact.whatsappDisplay}
              </a>
            </div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1.5 ring-1 ring-inset ring-white/15">
              <span className="size-1.5 rounded-full bg-seed-500" />
              <span className="text-xs text-white/70">
                Organización juvenil reconocida por SENAJU
              </span>
            </div>
          </div>

          {/* Enlaces */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {Object.entries(footerNav).map(([group, links]) => (
              <div key={group}>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-gold-500">
                  {group}
                </p>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/60 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/45">
            © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos reservados.
          </p>
          <ul className="flex flex-wrap gap-5">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-white/60 transition-colors hover:text-gold-500"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
