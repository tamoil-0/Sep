"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  error?: string[];
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const hintId = hint ? `${htmlFor}-hint` : undefined;
  const errorId = error?.length ? `${htmlFor}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const control = React.isValidElement<Record<string, unknown>>(children)
    ? React.cloneElement(children, {
        "aria-describedby": describedBy,
        "aria-invalid": error?.length ? true : undefined,
      })
    : children;

  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-graphite">
        {label}
        {required ? (
          <span className="ml-1 text-danger" aria-label="obligatorio">*</span>
        ) : (
          <span className="ml-1 font-normal text-mist">(opcional)</span>
        )}
      </label>
      {control}
      {hint && !error?.length && <p id={hintId} className="text-caption text-mist">{hint}</p>}
      {error?.length ? (
        <p id={errorId} className="text-caption font-medium text-danger" role="alert">
          {error[0]}
        </p>
      ) : null}
    </div>
  );
}

const controlBase =
  "w-full rounded-sm border border-line bg-white px-3.5 text-body-sm text-ink outline-none transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-mist focus:border-sep-500 focus:ring-4 focus:ring-sep-500/10 disabled:cursor-not-allowed disabled:bg-surface-1 disabled:opacity-70";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }
>(({ className, invalid, ...props }, ref) => (
  <input
    ref={ref}
    aria-invalid={invalid || undefined}
    className={cn(controlBase, "h-control", invalid && "border-danger", className)}
    {...props}
  />
));
Input.displayName = "Input";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }
>(({ className, invalid, children, ...props }, ref) => (
  <select
    ref={ref}
    aria-invalid={invalid || undefined}
    className={cn(
      controlBase,
      "h-control appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22none%22 stroke=%22%236E6A85%22 stroke-width=%222%22 stroke-linecap=%22round%22><path d=%22M4 6l4 4 4-4%22/></svg>')] bg-[position:right_0.9rem_center] bg-no-repeat pr-10",
      invalid && "border-danger",
      className,
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }
>(({ className, invalid, ...props }, ref) => (
  <textarea
    ref={ref}
    aria-invalid={invalid || undefined}
    className={cn(controlBase, "min-h-24 py-3", invalid && "border-danger", className)}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export function Checkbox({
  id,
  name,
  label,
  defaultChecked,
  required,
}: {
  id: string;
  name: string;
  label: React.ReactNode;
  defaultChecked?: boolean;
  required?: boolean;
}) {
  return (
    <label htmlFor={id} className="flex min-h-control cursor-pointer items-start gap-2.5 py-2">
      <input
        id={id}
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        required={required}
        className="mt-0.5 size-5 shrink-0 cursor-pointer rounded-sm border-line accent-sep-600"
      />
      <span className="text-sm leading-relaxed text-graphite">{label}</span>
    </label>
  );
}

export function FormAlert({
  tone,
  children,
}: {
  tone: "error" | "success" | "info" | "warning";
  children: React.ReactNode;
}) {
  const alertRef = React.useRef<HTMLDivElement>(null);
  const focusKey = typeof children === "string" ? children : tone;

  React.useEffect(() => {
    if (tone !== "error") return;

    const frame = window.requestAnimationFrame(() => {
      const alert = alertRef.current;
      const form = alert?.closest("form");
      const invalidControl = form?.querySelector<HTMLElement>(
        '[aria-invalid="true"]:not([disabled])',
      );

      (invalidControl ?? alert)?.focus({ preventScroll: true });
      (invalidControl ?? alert)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [focusKey, tone]);

  return (
    <div
      ref={alertRef}
      tabIndex={tone === "error" ? -1 : undefined}
      role={tone === "error" ? "alert" : "status"}
      aria-live={tone === "error" ? "assertive" : "polite"}
      className={cn(
        "rounded-sm border px-4 py-3 text-body-sm font-medium",
        tone === "error" && "border-danger/25 bg-danger-bg text-danger",
        tone === "success" && "border-success/25 bg-success-bg text-success",
        tone === "warning" && "border-warning/25 bg-warning-bg text-warning",
        tone === "info" && "border-info/25 bg-info-bg text-info",
      )}
    >
      {children}
    </div>
  );
}
