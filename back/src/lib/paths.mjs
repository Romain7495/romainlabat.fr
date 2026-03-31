import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Racine du dépôt (package.json, content/, assets/, dist/).
 * @param {string} importMetaUrl - import.meta.url du module appelant (ex. fichier dans back/src/cli/)
 * @param {number} [upFromFile=3] - remontée depuis le dossier du fichier jusqu’à la racine du repo
 */
export function getProjectRoot(importMetaUrl, upFromFile = 3) {
  const here = path.dirname(fileURLToPath(importMetaUrl));
  return path.resolve(here, ...Array(upFromFile).fill(".."));
}
