"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/forms/field";
import { Button } from "@/components/ui/button";

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
        className="tabular uppercase sm:flex-1"
        required
      />
      <Button type="submit" className="px-6">
        <Search aria-hidden className="size-4" />
        Verificar
      </Button>
    </form>
  );
}
