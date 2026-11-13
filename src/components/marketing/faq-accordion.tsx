"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function FaqAccordion({
  items,
  headingLevel: Heading = "h3",
}: {
  items: readonly { q: string; a: string }[];
  /** Nivel de las preguntas: `h2` cuando el acordeón cuelga directo del h1 de la página. */
  headingLevel?: "h2" | "h3";
}) {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <Heading>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                className="flex w-full items-start justify-between gap-6 py-5 text-left"
              >
                <span className="font-display text-body font-medium text-ink">
                  {item.q}
                </span>
                <Plus
                  className={cn(
                    "mt-0.5 size-5 shrink-0 text-slate-ui transition-transform duration-200",
                    isOpen && "rotate-45 text-sep-600",
                  )}
                />
              </button>
            </Heading>
            <div
              id={`faq-panel-${i}`}
              hidden={!isOpen}
              className="pb-6 pr-12 text-body-sm leading-relaxed text-slate-ui"
            >
              {item.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}
