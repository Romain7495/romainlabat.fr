import { mkdir } from "node:fs/promises";
import path from "node:path";

/** Crée le dossier parent d’un fichier de sortie si besoin. */
export async function ensureParentDir(filePath) {
  await mkdir(path.dirname(filePath), { recursive: true });
}
