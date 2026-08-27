import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("../src/", import.meta.url).pathname.replace(/^\/(.:\/)/, "$1");

const replacements = new Map([
  ["rounded-[5px]", "rounded-sm"],
  ["rounded-[6px]", "rounded-sm"],
  ["rounded-[8px]", "rounded-sm"],
  ["rounded-[9px]", "rounded-sm"],
  ["rounded-[10px]", "rounded-sm"],
  ["rounded-[11px]", "rounded-md"],
  ["rounded-[12px]", "rounded-md"],
  ["rounded-[14px]", "rounded-md"],
  ["rounded-[15px]", "rounded-lg"],
  ["rounded-[16px]", "rounded-lg"],
  ["rounded-[18px]", "rounded-lg"],
  ["rounded-[20px]", "rounded-lg"],
  ["rounded-[24px]", "rounded-xl"],
  ["text-[0.625rem]", "text-caption"],
  ["text-[0.65rem]", "text-caption"],
  ["text-[0.6875rem]", "text-caption"],
  ["text-[0.72rem]", "text-caption"],
  ["text-[0.8125rem]", "text-body-sm"],
  ["text-[0.82rem]", "text-body-sm"],
  ["text-[0.875rem]", "text-body-sm"],
  ["text-[0.9375rem]", "text-body-sm"],
  ["text-[1rem]", "text-body"],
  ["text-[1.0625rem]", "text-body"],
  ["text-[1.125rem]", "text-body-lg"],
  ["text-[1.25rem]", "text-h4"],
  ["text-[1.35rem]", "text-h4"],
  ["text-[1.375rem]", "text-h4"],
  ["text-[1.45rem]", "text-h3"],
  ["text-[1.5rem]", "text-h3"],
  ["text-[1.625rem]", "text-h3"],
  ["text-[1.75rem]", "text-h2"],
  ["text-[1.8rem]", "text-h2"],
  ["text-[1.875rem]", "text-h2"],
  ["text-[2rem]", "text-h2"],
  ["text-[2.2rem]", "text-h1"],
  ["text-[2.25rem]", "text-h1"],
  ["text-[2.35rem]", "text-h1"],
  ["text-[2.5rem]", "text-h1"],
  ["text-[2.75rem]", "text-h1"],
  ["text-[3rem]", "text-display"],
  ["text-[3.25rem]", "text-display"],
  ["text-[3.35rem]", "text-display"],
  ["text-[3.65rem]", "text-display"],
  ["inline-flex h-8", "inline-flex min-h-control"],
  ["inline-flex h-9", "inline-flex min-h-control"],
  ["inline-flex h-10", "inline-flex min-h-control"],
  ["inline-flex size-7", "inline-flex size-control"],
  ["inline-flex size-8", "inline-flex size-control"],
  ["inline-flex size-9", "inline-flex size-control"],
  ["inline-flex size-10", "inline-flex size-control"],
]);

function files(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}

let changed = 0;
for (const path of files(root).filter((path) => /\.(tsx|ts)$/.test(path))) {
  const before = readFileSync(path, "utf8");
  let after = before;
  for (const [from, to] of replacements) after = after.replaceAll(from, to);
  after = after.replace(/shadow-\[[^\]]+\]/g, (value) =>
    /^shadow-\[0_(12px_36|16px|18px|24px)/.test(value) ? "shadow-elevated" : "shadow-card",
  );
  if (after !== before) {
    writeFileSync(path, after);
    changed += 1;
  }
}

console.log(`Normalized UI tokens in ${changed} files.`);
