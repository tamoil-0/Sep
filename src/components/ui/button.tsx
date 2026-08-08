import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sep-500",
  {
    variants: {
      variant: {
        primary:
          "bg-sep-600 text-white shadow-[0_1px_3px_rgba(18,16,28,.08)] hover:bg-sep-700 active:bg-sep-800",
        gradient:
          "sep-gradient text-white shadow-[0_4px_16px_rgba(46,11,232,.24)] hover:shadow-[0_8px_24px_rgba(46,11,232,.32)] hover:-translate-y-px",
        gold: "bg-gold-500 text-ink hover:bg-gold-400 active:bg-gold-600 shadow-[0_2px_8px_rgba(255,198,41,.35)]",
        outline:
          "border border-line bg-white text-ink hover:bg-surface-1 hover:border-mist",
        "outline-white":
          "border border-white/35 bg-white/5 text-white backdrop-blur-sm hover:bg-white/15 hover:border-white/60",
        ghost: "text-graphite hover:bg-surface-2 hover:text-ink",
        link: "text-sep-600 underline-offset-4 hover:underline p-0 h-auto",
        danger: "bg-danger text-white hover:brightness-110",
      },
      size: {
        sm: "h-9 px-3.5 text-sm [&_svg]:size-4",
        md: "h-11 px-5 text-[0.9375rem] [&_svg]:size-[18px]",
        lg: "h-[52px] px-7 text-base [&_svg]:size-5",
        icon: "h-10 w-10 [&_svg]:size-[18px]",
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
