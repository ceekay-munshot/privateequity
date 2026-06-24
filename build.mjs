/* ============================================================
   Build step — precompile JSX → plain classic-script JS in ./build
   ------------------------------------------------------------
   This app ships with NO in-browser Babel and NO CDN dependency.
   React/ReactDOM are vendored locally in ./vendor and the JSX is
   precompiled here. The compiled files are committed so the site
   deploys as pure static assets (no build needed at deploy time).

   Run `npm run build` after editing any .jsx to refresh ./build.
   ============================================================ */
import { readdirSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { transformFileSync } from "@babel/core";

const OUT = "build";
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const files = readdirSync(".").filter((f) => f.endsWith(".jsx")).sort();
let n = 0;
for (const f of files) {
  const { code } = transformFileSync(f, {
    presets: [["@babel/preset-react", { runtime: "classic" }]],
    sourceType: "script", // classic scripts share one global scope (like the original <script> tags)
    comments: false,
    compact: false,
    babelrc: false,
    configFile: false,
  });
  const out = `${OUT}/${f.replace(/\.jsx$/, ".js")}`;
  writeFileSync(out, code);
  n++;
}
console.log(`✓ Precompiled ${n} .jsx files → ./${OUT}`);
