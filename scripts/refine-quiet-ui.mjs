import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("../src/", import.meta.url).pathname.replace(/^\/(.:\/)/, "$1");

const replacements = new Map([
  ["hover:shadow-elevated", ""],
  ["hover:shadow-card", ""],
  ["open:shadow-card", ""],
  ["shadow-card", ""],
  ["backdrop-blur-xl", ""],
  ["backdrop-blur-md", ""],
  ["backdrop-blur-sm", ""],
  ["bg-white/95", "bg-white"],
  ["bg-white/92", "bg-white"],
  ["bg-white/80", "bg-white"],
  ["sep-gradient-text", "text-sep-700"],
  ["rounded-full sep-gradient", "rounded-full bg-sep-700"],
  ["rounded-sm sep-gradient", "rounded-sm bg-sep-600"],
  ["transition-all", "transition-colors"],
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
  if (after !== before) {
    writeFileSync(path, after);
    changed += 1;
  }
}

console.log(`Refined quiet UI in ${changed} files.`);
