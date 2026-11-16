import { createPageMetadata, serializeJsonLd } from "@/lib/seo";
import { Container, Section, SectionHeader } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { faqs, siteConfig } from "@/config/site";

// Estática con ISR: no lee la petición; se sirve desde la CDN.
export const dynamic = "force-static";
export const revalidate = 300;

export const metadata = createPageMetadata({
  title: "Preguntas frecuentes",
  description:
    "Todo lo que suelen preguntarnos sobre voluntariado, cursos, certificados y alianzas con SEP.",
  path: "/faq",
  keywords: ["preguntas SEP", "certificados SEP", "cursos SEP"],
});

export default function FaqPage() {
  return (
    <>
    <Section tone="night">
      <Container size="narrow">
        <SectionHeader
          as="h1"
          eyebrow="Preguntas frecuentes"
          title="Lo que suelen preguntarnos"
          align="center"
        />
      </Container>
    </Section>

    <Section>
      <Container size="narrow">
        <div>
          <FaqAccordion items={faqs} headingLevel="h2" />
        </div>

        <div className="mt-12 rounded-md border border-line bg-surface-1 p-7 text-center">
          <h2 className="font-display text-h4 font-semibold text-ink">
            ¿No encontraste tu respuesta?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-body-sm leading-relaxed text-slate-ui">
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
          __html: serializeJsonLd({
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
    </>
  );
}
