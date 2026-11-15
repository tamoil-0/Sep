import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Artefactos que genera el CLI de Supabase al levantar el entorno local.
    "supabase/.temp/**",
    "supabase/.branches/**",
    // Scripts de terceros (minificados) que trae la skill impeccable; no son código del proyecto.
    ".claude/skills/impeccable/**",
  ]),
]);

export default eslintConfig;
