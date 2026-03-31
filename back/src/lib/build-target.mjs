/**
 * Résolution de la cible de build (Strategy simple par locale).
 * Chemins relatifs à la racine du projet (voir `paths.getProjectRoot`).
 */

/** @typedef {{ id: 'en' | 'fr'; resumeFile: string; htmlFile: string; pdfFile: string }} BuildTarget */

const TARGETS = Object.freeze({
  en: Object.freeze({
    id: "en",
    resumeFile: "content/resume-en.json",
    htmlFile: "dist/html/resume-en.html",
    pdfFile: "dist/pdf/resume-en.pdf",
  }),
  fr: Object.freeze({
    id: "fr",
    resumeFile: "content/resume-fr.json",
    htmlFile: "dist/html/resume-fr.html",
    pdfFile: "dist/pdf/resume-fr.pdf",
  }),
});

/**
 * @param {string | undefined} cliArg - argv[2], ex. "en" | "fr" | "french"
 * @returns {BuildTarget}
 */
export function resolveBuildTarget(cliArg) {
  const raw = (cliArg || "en").toLowerCase();
  if (raw === "fr" || raw === "french") return TARGETS.fr;
  return TARGETS.en;
}

export { TARGETS };
