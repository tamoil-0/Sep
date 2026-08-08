/**
 * Elimina los imports que ESLint marca como no usados.
 *
 * Se generó mucha pantalla a partir de plantillas compartidas y algunas
 * heredaron imports que no llegaron a usar. Esto los limpia sin tocar nada más.
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const out = execSync("npx eslint --format json src", {
  encoding: "utf8",
  maxBuffer: 32 * 1024 * 1024,
});

const results = JSON.parse(out);
let cleaned = 0;

for (const file of results) {
  const unused = file.messages
    .filter((m) => m.ruleId === "@typescript-eslint/no-unused-vars")
    .map((m) => /'([^']+)' is defined but never used/.exec(m.message)?.[1])
    .filter(Boolean);

  if (unused.length === 0) continue;

  let src = readFileSync(file.filePath, "utf8");

  for (const name of unused) {
    // Quita el identificador de la lista de un import con llaves.
    src = src.replace(
      /import\s*\{([^}]*)\}\s*from\s*(["'][^"']+["'];)/g,
      (match, inner, tail) => {
        const parts = inner
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean);
        if (!parts.some((p) => p === name || p.endsWith(` ${name}`))) return match;
        const kept = parts.filter((p) => p !== name && !p.endsWith(` ${name}`));
        if (kept.length === 0) return "";
        return `import { ${kept.join(", ")} } from ${tail}`;
      },
    );
  }

  // Limpia las líneas vacías que deja un import eliminado por completo.
  src = src.replace(/\n{3,}/g, "\n\n");
  writeFileSync(file.filePath, src);
  cleaned += 1;
}

console.log(`archivos limpiados: ${cleaned}`);
