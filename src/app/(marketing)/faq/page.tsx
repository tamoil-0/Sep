import type { Metadata } from "next";
import { Container, Section, SectionHeader } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { faqs, siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Todo lo que suelen preguntarnos sobre voluntariado, cursos, certificados y alianzas con SEP.",
};

export default function FaqPage() {
  return (
    <Section>
      <Container size="narrow">
        <SectionHeader
          eyebrow="Preguntas frecuentes"
          title="Lo que suelen preguntarnos"
          align="center"
        />

        <div className="mt-10">
          <FaqAccordion items={faqs} />
        </div>

        <div className="mt-12 rounded-[14px] border border-line bg-surface-1 p-7 text-center">
          <h2 className="font-display text-[1.25rem] font-semibold text-ink">
            ¿No encontraste tu respuesta?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-ui">
            Escríbenos por WhatsApp o al correo. Respondemos de verdad, no con bots.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={siteConfig.contact.whatsappUrl} variant="primary">
              WhatsApp
            </Button>
            <Button href={`mailto:${siteConfig.contact.email}`} variant="outline">
              {siteConfig.contact.email}
            </Button>
          </div>
        </div>
      </Container>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
    </Section>
  );
}
