/**
 * Constantes de mise en page PDF partagées (CI + CLI).
 * Viewport Puppeteer = zone imprimable A4 après marge basse (évite bandeau bleu tronqué).
 */

export const PDF_PAGE = Object.freeze({
  widthMm: 210,
  heightMm: 297,
  marginBottomMm: 12,
});

/** @param {number} mm */
export function mmToPx(mm) {
  return Math.round((mm / 25.4) * 96);
}

export function getPrintViewportSize() {
  const w = mmToPx(PDF_PAGE.widthMm);
  const h = mmToPx(PDF_PAGE.heightMm) - mmToPx(PDF_PAGE.marginBottomMm);
  return { width: w, height: h };
}
