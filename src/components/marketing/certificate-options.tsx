import { Check } from "lucide-react";
import { Badge, Card } from "@/components/ui/primitives";
import { formatSoles } from "@/lib/utils";

/**
 * Opciones de certificación: la misma tarjeta en la home y en /cursos para que
 * el precio, el emisor y el estado "en trámite" se lean igual en todo el sitio.
 */
export function CertificateOptions({
  showVerification = false,
  className,
}: {
  showVerification?: boolean;
  className?: string;
}) {
  return (
    <div className={className ?? "mx-auto grid max-w-2xl gap-4 sm:grid-cols-2"}>
      <Card className="flex flex-col">
        <p className="tabular font-display text-h1 font-bold leading-none text-ink">
          {formatSoles(3000)}
        </p>
        <h3 className="mt-4 font-display text-body leading-snug font-semibold text-ink">Certificado SEP</h3>
        <p className="mt-1 text-caption text-slate-ui">Semillero de Emprendedores Perú</p>
        {showVerification && (
          <p className="mt-4 flex items-center gap-2 border-t border-line pt-4 text-caption text-slate-ui">
            <Check aria-hidden className="size-icon-sm text-seed-700" />
            Código de verificación público
          </p>
        )}
      </Card>

      <Card className="flex flex-col items-start justify-center border-dashed bg-surface-1">
        <Badge>En trámite</Badge>
        <h3 className="mt-3 font-display text-body leading-snug font-semibold text-graphite">
          Certificado internacional
        </h3>
      </Card>
    </div>
  );
}
