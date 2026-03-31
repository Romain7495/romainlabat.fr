import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(webRoot, "..");
const publicDir = path.join(webRoot, "public");

await mkdir(publicDir, { recursive: true });

for (const f of ["resume-en.pdf", "resume-fr.pdf"]) {
  const src = path.join(repoRoot, "dist", "pdf", f);
  const dest = path.join(publicDir, f);
  try {
    await copyFile(src, dest);
    console.log(`synced ${f}`);
  } catch {
    console.warn(`skip ${f} (run npm run build at repo root first)`);
  }
}
