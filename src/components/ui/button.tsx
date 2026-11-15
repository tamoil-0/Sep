import * as React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Píldora: el control es la pieza más pequeña de la jerarquía de radios
  // (botón redondo < tarjeta 16px < superficie 22px).
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background-color,background-position,border-color,color,box-shadow,transform] duration-300 ease-out active:scale-98 disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violeta-500",
  {
    variants: {
      variant: {
        // Blanco sobre violeta-600: 5.38:1; hover violeta-700: 6.99:1. Igual sobre claro y noche.
        // Hover: el fondo se desliza por un degradado violeta 600→800 (blanco ≥ 5.38 en todo el
        // recorrido), sube 2 px y gana el brillo de marca (`btn-desliza`, globals.css).
        primary: "btn-desliza bg-violeta-600 text-white shadow-highlight",
        // Botón neón: noche sobre cian (11.17:1). Solo en bloques oscuros, uno por pantalla,
        // para la conversión principal del marketing.
        neon: "bg-cian-500 text-noche-900 hover:-translate-y-0.5 hover:bg-cian-600 hover:shadow-glow-neon",
        outline:
          "border border-line bg-surface-0 text-ink hover:border-violeta-300 hover:bg-violeta-50",
        "outline-white":
          "border border-white/25 bg-white/5 text-white backdrop-blur-sm hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/10",
        ghost: "text-graphite hover:bg-surface-2 hover:text-ink",
        link: "text-acento underline-offset-4 hover:underline p-0 h-auto",
        danger: "bg-danger text-white hover:bg-danger-700 active:bg-danger-800",
      },
      size: {
        sm: "h-control px-3.5 text-body-sm [&_svg]:size-icon-sm",
        md: "h-control px-5 text-body-sm [&_svg]:size-icon-md",
        lg: "h-control-lg px-7 text-body [&_svg]:size-icon-lg",
        icon: "size-control [&_svg]:size-icon-md",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
  /** Precarga la ruta al entrar en viewport. Solo aplica a enlaces internos. */
  prefetch?: boolean;
  /** Muestra un spinner sin cambiar el ancho del botón y lo deshabilita. */
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, href, prefetch, loading = false, children, disabled, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size }), className);
    // El contenido sigue ocupando su lugar (invisible) para que el ancho no salte.
    const content = loading ? (
      <>
        <span className="invisible inline-flex items-center gap-2">{children}</span>
        <Loader2 aria-hidden className="absolute animate-spin" />
        <span className="sr-only">Cargando…</span>
      </>
    ) : (
      children
    );

    if (href) {
      const isExternal = /^https?:\/\//.test(href);
      if (isExternal) {
        return (
          <a
            href={href}
            className={classes}
            target="_blank"
            rel="noopener noreferrer"
            {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          >
            {children}
          </a>
        );
      }
      return (
        <Link
          href={href}
          prefetch={prefetch}
          className={classes}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {content}
      </button>
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
