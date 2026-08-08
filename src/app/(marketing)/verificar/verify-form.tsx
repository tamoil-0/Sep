"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/forms/field";

export function VerifyForm() {
  const router = useRouter();
  const [code, setCode] = React.useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const clean = code.trim().toUpperCase();
    if (clean) router.push(`/verificar/${encodeURIComponent(clean)}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2.5 sm:flex-row">
      <label htmlFor="code" className="sr-only">
        Código de verificación
      </label>
      <Input
        id="code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="SEP-2026-XXXXXX"
        autoComplete="off"
        spellCheck={false}
        className="tabular flex-1 uppercase"
        required
      />
      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-sep-600 px-6 text-[0.9375rem] font-medium text-white transition-colors hover:bg-sep-700"
      >
        <Search className="size-4" />
        Verificar
      </button>
    </form>
  );
}
