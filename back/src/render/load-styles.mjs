import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const cssPath = path.join(dir, "compact-cv.css");

let cache = null;

/** @returns {Promise<string>} */
export async function getCompactCvStylesheet() {
  if (cache == null) {
    cache = await readFile(cssPath, "utf-8");
  }
  return cache;
}

/** Pour tests / invalidation éventuelle */
export function clearStylesheetCache() {
  cache = null;
}
