import { readFile } from "node:fs/promises";
import path from "node:path";

export async function resolveImageSrc(basics, rootDir) {
  const img = basics?.image;
  if (!img) return null;
  if (/^https?:\/\//i.test(img)) return img;
  if (!rootDir) return null;
  const p = path.isAbsolute(img) ? img : path.join(rootDir, img);
  try {
    const buf = await readFile(p);
    const ext = path.extname(p).toLowerCase();
    const mime =
      ext === ".png"
        ? "image/png"
        : ext === ".jpg" || ext === ".jpeg"
          ? "image/jpeg"
          : ext === ".webp"
            ? "image/webp"
            : "application/octet-stream";
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}
