/**
 * Fusion des options Puppeteer page.pdf() avec les overrides JSON Resume (meta.pdfRenderOptions).
 * La marge basse est toujours appliquée en dernier (réserve blanche).
 */

const PDF_MARGIN_BOTTOM = "12mm";

const BASE_PDF_OPTIONS = Object.freeze({
  format: "A4",
  printBackground: true,
  preferCSSPageSize: false,
  margin: Object.freeze({
    top: "0",
    right: "0",
    bottom: PDF_MARGIN_BOTTOM,
    left: "0",
  }),
  tagged: true,
  waitForFonts: true,
});

/**
 * @param {Record<string, unknown> | undefined} metaPdfRenderOptions - resume.meta.pdfRenderOptions
 */
export function buildPdfOptions(metaPdfRenderOptions = {}) {
  const merged = {
    ...BASE_PDF_OPTIONS,
    ...metaPdfRenderOptions,
    preferCSSPageSize: false,
    margin: {
      top: metaPdfRenderOptions.margin?.top ?? BASE_PDF_OPTIONS.margin.top,
      right: metaPdfRenderOptions.margin?.right ?? BASE_PDF_OPTIONS.margin.right,
      bottom: PDF_MARGIN_BOTTOM,
      left: metaPdfRenderOptions.margin?.left ?? BASE_PDF_OPTIONS.margin.left,
    },
  };
  return merged;
}
