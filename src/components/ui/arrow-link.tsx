import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Enlace de texto con flecha ("Ver detalle →", "Explorar cursos →").
 *
 * El texto mide ~20px de alto, así que el área táctil se amplía a 44px con un
 * pseudo-elemento sin mover el layout. Con `stretched`, el área cubre el
 * contenedor posicionado más cercano: úsalo dentro de una `Card` con
 * `className="relative"` para que toda la tarjeta sea el enlace.
 */
export function ArrowLink({
  href,
  children,
  className,
  prefetch,
  stretched = false,
  tone = "brand",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  prefetch?: boolean;
  stretched?: boolean;
  tone?: "brand" | "white";
}) {
  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={cn(
        "group/arrow inline-flex w-fit items-center gap-1.5 text-body-sm font-medium underline-offset-4 hover:underline",
        "after:absolute after:content-['']",
        stretched ? "after:inset-0" : "relative after:-inset-x-1 after:-inset-y-3",
        tone === "brand" ? "text-sep-600 hover:text-sep-700" : "text-white hover:text-white/90",
        className,
      )}
    >
      {children}
      <ArrowRight
        aria-hidden
        className="size-icon-sm transition-transform duration-150 group-hover/arrow:translate-x-0.5"
      />
    </Link>
  );
}
