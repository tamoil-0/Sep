import type { Metadata } from "next";
import Link from "next/link";
import { CircleX, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, Container, Section } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Resultado de verificación",
  robots: { index: false, follow: false },
};

export default async function VerificarCodigoPage({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const { codigo } = await params;
  const code = decodeURIComponent(codigo).toUpperCase();

  const supabase = await createClient();
  // Función SECURITY DEFINER: devuelve solo lo mínimo, sin exponer PII (§8.4).
  const { data, error } = await supabase.rpc("verify_certificate", { code });

  const record = Array.isArray(data) ? data[0] : null;
  const valid = !error && record?.is_valid === true;

  return (
    <Section>
      <Container size="narrow">
        {valid && record ? (
          <Card className="overflow-hidden p-0">
            <div className="sep-gradient px-8 py-7">
              <Logo className="h-7" variant="white" />
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-sm font-medium text-white ring-1 ring-inset ring-white/25">
                <ShieldCheck className="size-4 text-gold-500" />
                Certificado válido
              </p>
            </div>

            <div className="p-8">
              <dl className="divide-y divide-line">
                {[
                  ["Otorgado a", record.holder_name],
                  ["Programa", record.course_title],
                  ["Certificado", record.certificate],
                  ["Emitido por", record.issuer],
                  [
                    "Fecha de emisión",
                    record.issued_at ? formatDate(record.issued_at) : "—",
                  ],
                  ["Código", code],
                ].map(([label, value]) => (
                  <div key={label} className="flex flex-wrap justify-between gap-2 py-3.5">
                    <dt className="text-sm text-slate-ui">{label}</dt>
                    <dd className="text-sm font-medium text-ink">{value}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-6 text-xs leading-relaxed text-slate-ui">
                Este certificado fue emitido por el Semillero de Emprendedores Perú,
                organización juvenil reconocida por SENAJU. Si detectas alguna
                inconsistencia, escríbenos a semilleroemprendedorperu@gmail.com
              </p>
            </div>
          </Card>
        ) : (
          <Card className="p-8 text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-danger-bg text-danger">
              <CircleX className="size-6" />
            </span>
            <h1 className="mt-5 font-display text-[1.5rem] font-semibold text-ink">
              No encontramos ese certificado
            </h1>
            <p className="mx-auto mt-2.5 max-w-md text-[0.9375rem] leading-relaxed text-slate-ui">
              El código <span className="tabular font-medium text-ink">{code}</span> no
              corresponde a ningún certificado emitido, o el certificado fue revocado.
              Revisa que lo hayas escrito exactamente como aparece en el documento.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button href="/verificar" variant="outline">
                Intentar con otro código
              </Button>
              <Button href="/contacto" variant="ghost">
                Reportar un problema
              </Button>
            </div>
          </Card>
        )}

        <p className="mt-6 text-center text-sm text-slate-ui">
          <Link href="/" className="hover:underline">
            Volver al inicio de SEP
          </Link>
        </p>
      </Container>
    </Section>
  );
}
