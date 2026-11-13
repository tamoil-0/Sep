import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Píldora: el control es la pieza más pequeña de la jerarquía de radios
  // (botón redondo < tarjeta 16px < superficie 22px).
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sep-500",
  {
    variants: {
      variant: {
        primary:
          "bg-sep-600 text-white shadow-highlight hover:bg-sep-700 hover:shadow-glow active:bg-sep-800",
        gradient:
          "sep-gradient text-white shadow-highlight hover:shadow-glow",
        gold: "bg-gold-500 text-ink hover:bg-gold-400 hover:shadow-glow-gold active:bg-gold-400",
        outline:
          "border border-line bg-surface-0 text-ink hover:border-sep-300 hover:bg-sep-50",
        "outline-white":
          "border border-white/25 bg-white/5 text-white backdrop-blur-sm hover:border-white/50 hover:bg-white/10",
        ghost: "text-graphite hover:bg-surface-2 hover:text-ink",
        link: "text-sep-600 underline-offset-4 hover:underline p-0 h-auto",
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
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, href, prefetch, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size }), className);

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
          />
        );
      }
      return (
        <Link
          href={href}
          prefetch={prefetch}
          className={classes}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        />
      );
    }

    return <button ref={ref} className={classes} {...props} />;
  },
);
Button.displayName = "Button";

export { buttonVariants };
