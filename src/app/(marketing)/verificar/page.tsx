import { createPageMetadata } from "@/lib/seo";
import { ShieldCheck } from "lucide-react";
import { Container, Section, SectionHeader } from "@/components/ui/primitives";
import { VerifyForm } from "./verify-form";

export const metadata = createPageMetadata({
  title: "Verificar certificado",
  description:
    "Comprueba la autenticidad de un certificado emitido por el Semillero de Emprendedores Perú con su código de verificación.",
  path: "/verificar",
  keywords: ["verificar certificado SEP", "certificado Semillero de Emprendedores Perú"],
});

export default function VerificarPage() {
  return (
    <Section>
      <Container size="narrow">
        <div className="text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-[14px] bg-sep-50 text-sep-600">
            <ShieldCheck className="size-6" />
          </span>
          <div className="mt-6">
            <SectionHeader
              title="Verificar un certificado"
              description="Escribe el código que aparece en el certificado (por ejemplo, SEP-2026-A7K3M9) para comprobar su autenticidad."
              align="center"
            />
          </div>
        </div>

        <div className="mt-10">
          <VerifyForm />
        </div>
      </Container>
    </Section>
  );
}
