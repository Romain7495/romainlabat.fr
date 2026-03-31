import { copyFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(webRoot, "..");
const publicDir = path.join(webRoot, "public");

/** Échec explicite en predev si les PDF ne sont pas là (après `npm run build` à la racine). */
const strict =
  process.env.npm_lifecycle_event === "predev" ||
  process.argv.includes("--strict");

await mkdir(publicDir, { recursive: true });

for (const f of ["resume-en.pdf", "resume-fr.pdf"]) {
  const src = path.join(repoRoot, "dist", "pdf", f);
  const dest = path.join(publicDir, f);
  try {
    await stat(src);
    await copyFile(src, dest);
    console.log(`sync-public: ${f} → web/public/`);
  } catch (err) {
    const msg = `sync-public: missing ${src} — run npm run build at repo root first`;
    if (strict) {
      console.error(msg);
      process.exit(1);
    }
    console.warn(`skip ${f} (${msg})`);
  }
}
