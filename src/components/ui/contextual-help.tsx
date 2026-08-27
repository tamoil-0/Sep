import { Mail, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function ContextualHelp({
  title = "¿Necesitas ayuda?",
  description = "Cuéntanos en qué paso te quedaste y el equipo de SEP te orientará.",
  className,
  inverse = false,
}: {
  title?: string;
  description?: string;
  className?: string;
  inverse?: boolean;
}) {
  return (
    <aside
      aria-labelledby="contextual-help-title"
      className={cn(
        "rounded-sm border border-line bg-surface-1 p-4 text-left",
        inverse && "border-white/20 bg-white/10",
        className,
      )}
    >
      <p
        id="contextual-help-title"
        className={cn("text-body-sm font-semibold text-ink", inverse && "text-white")}
      >
        {title}
      </p>
      <p className={cn("mt-1 text-caption text-slate-ui", inverse && "text-white/75") }>
        {description}
      </p>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
        <a
          href={`mailto:${siteConfig.contact.email}`}
          className={cn(
            "inline-flex min-h-control items-center gap-2 text-caption font-semibold text-sep-700 hover:underline",
            inverse && "text-white",
          )}
        >
          <Mail className="size-icon-sm" /> Escribir por correo
        </a>
        <a
          href={siteConfig.contact.whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "inline-flex min-h-control items-center gap-2 text-caption font-semibold text-sep-700 hover:underline",
            inverse && "text-white",
          )}
        >
          <MessageCircle className="size-icon-sm" /> WhatsApp
        </a>
      </div>
    </aside>
  );
}
