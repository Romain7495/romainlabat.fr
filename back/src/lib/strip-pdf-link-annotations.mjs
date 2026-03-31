import { PDFDocument, PDFName } from "pdf-lib";

/**
 * Supprime la clé /Annots de chaque page.
 *
 * Chromium écrit des annotations de type Link pour les <a href>. macOS Aperçu (et
 * d’autres lecteurs) les affichent en bleu souligné par défaut, en plus du texte
 * déjà rendu par le moteur — d’où des liens « en carton » malgré le CSS.
 *
 * Sans /Annots, le PDF garde uniquement l’apparence peinte (couleurs CSS) ; les
 * URLs ne sont plus cliquables dans le fichier.
 */
export async function stripPdfLinkAnnotations(pdfBytes) {
  const doc = await PDFDocument.load(pdfBytes, {
    ignoreEncryption: true,
    updateMetadata: false,
  });
  const annotsName = PDFName.of("Annots");
  for (const page of doc.getPages()) {
    const leaf = page.node;
    if (leaf.has(annotsName)) {
      leaf.delete(annotsName);
    }
  }
  return Buffer.from(await doc.save({ useObjectStreams: false }));
}
