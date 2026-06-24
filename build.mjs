/* ============================================================
   Build step for static hosts (Cloudflare Pages, Netlify, etc.)
   This app is buildless — it runs directly from source in the
   browser via Babel Standalone. There is nothing to compile, so
   this script simply copies the static assets into ./dist so the
   host has a clean, conventional output directory to publish.

   Works whether the host's output directory is set to "dist" or
   the repository root (index.html lives in both).
   ============================================================ */
import { cpSync, rmSync, mkdirSync, readdirSync } from "node:fs";

const OUT = "dist";

// Files/dirs that should never be published.
const EXCLUDE = new Set([
  OUT,
  "node_modules",
  ".git",
  ".gitignore",
  "build.mjs",
  "package.json",
  "package-lock.json",
  "wrangler.toml",
  "README.md",
]);

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

let copied = 0;
for (const entry of readdirSync(".", { withFileTypes: true })) {
  if (EXCLUDE.has(entry.name)) continue;
  cpSync(entry.name, `${OUT}/${entry.name}`, { recursive: true });
  copied++;
}

console.log(`✓ Copied ${copied} top-level entries to ./${OUT}`);
