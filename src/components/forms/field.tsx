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
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-graphite">
        {label}
        {required && <span className="ml-0.5 text-danger">*</span>}
      </label>
      {children}
      {hint && !error?.length && <p className="text-xs text-mist">{hint}</p>}
      {error?.length ? (
        <p className="text-xs text-danger" role="alert">
          {error[0]}
        </p>
      ) : null}
    </div>
  );
}

const controlBase =
  "w-full rounded-[10px] border border-line bg-white px-3.5 text-[0.9375rem] text-ink outline-none transition-colors placeholder:text-mist focus:border-sep-400 focus:ring-4 focus:ring-sep-500/10 disabled:opacity-60";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }
>(({ className, invalid, ...props }, ref) => (
  <input
    ref={ref}
    aria-invalid={invalid || undefined}
    className={cn(controlBase, "h-11", invalid && "border-danger", className)}
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
      "h-11 appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22none%22 stroke=%22%236E6A85%22 stroke-width=%222%22 stroke-linecap=%22round%22><path d=%22M4 6l4 4 4-4%22/></svg>')] bg-[position:right_0.9rem_center] bg-no-repeat pr-10",
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
    className={cn(controlBase, "min-h-24 py-2.5", invalid && "border-danger", className)}
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
    <label htmlFor={id} className="flex cursor-pointer items-start gap-2.5">
      <input
        id={id}
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        required={required}
        className="mt-0.5 size-[18px] shrink-0 cursor-pointer rounded-[5px] border-line accent-sep-600"
      />
      <span className="text-sm leading-relaxed text-graphite">{label}</span>
    </label>
  );
}

export function FormAlert({
  tone,
  children,
}: {
  tone: "error" | "success";
  children: React.ReactNode;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-[10px] border px-4 py-3 text-sm",
        tone === "error"
          ? "border-danger/25 bg-danger-bg text-danger"
          : "border-success/25 bg-success-bg text-success",
      )}
    >
      {children}
    </div>
  );
}
