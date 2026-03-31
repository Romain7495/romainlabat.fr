import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import puppeteer from "puppeteer";
import { buildCompactHtml } from "./compact-render.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const lang = (process.argv[2] || "en").toLowerCase();
const isFr = lang === "fr" || lang === "french";
const resumePath = path.join(root, isFr ? "resume.fr.json" : "resume.json");
const outPath = path.join(root, isFr ? "resume-fr.pdf" : "resume.pdf");

const resume = JSON.parse(await readFile(resumePath, "utf-8"));
const html = await buildCompactHtml(resume, { rootDir: root });

const fromResume = resume.meta?.pdfRenderOptions ?? {};
const pdfOptions = {
  format: "A4",
  printBackground: true,
  preferCSSPageSize: false,
  margin: { top: "0", right: "0", bottom: "12mm", left: "0" },
  tagged: true,
  waitForFonts: true,
  ...fromResume,
};
pdfOptions.preferCSSPageSize = false;
pdfOptions.margin = {
  top: fromResume.margin?.top ?? "0",
  right: fromResume.margin?.right ?? "0",
  bottom: "12mm",
  left: fromResume.margin?.left ?? "0",
};

const browser = await puppeteer.launch({
  headless: true,
  args: ["--disable-font-subpixel-positioning"],
});
const page = await browser.newPage();
const mmToPx = (mm) => Math.round((mm / 25.4) * 96);
const a4w = mmToPx(210);
const a4h = mmToPx(297);
const bottomMm = 12;
const viewportH = a4h - mmToPx(bottomMm);
await page.setViewport({ width: a4w, height: viewportH, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: "domcontentloaded", baseURL: `file://${root}/` });
const buf = await page.pdf(pdfOptions);
await browser.close();
await writeFile(outPath, buf);
console.log(`Wrote ${outPath} (${isFr ? "fr" : "en"})`);
