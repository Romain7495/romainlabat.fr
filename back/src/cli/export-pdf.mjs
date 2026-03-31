import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer";
import { getProjectRoot } from "../lib/paths.mjs";
import { resolveBuildTarget } from "../lib/build-target.mjs";
import { ensureParentDir } from "../lib/ensure-dir.mjs";
import { getPrintViewportSize } from "../lib/pdf-layout.mjs";
import { buildPdfOptions } from "../lib/pdf-options.mjs";
import { buildCompactHtml } from "../render/html-document.mjs";

const root = getProjectRoot(import.meta.url);
const target = resolveBuildTarget(process.argv[2]);
const resumePath = path.join(root, target.resumeFile);
const outPath = path.join(root, target.pdfFile);

const resume = JSON.parse(await readFile(resumePath, "utf-8"));
const html = await buildCompactHtml(resume, { rootDir: root });

const pdfOptions = buildPdfOptions(resume.meta?.pdfRenderOptions);

const isCi = process.env.CI === "true";
const browser = await puppeteer.launch({
  headless: true,
  args: [
    "--disable-font-subpixel-positioning",
    ...(isCi ? ["--no-sandbox", "--disable-setuid-sandbox"] : []),
  ],
});
const page = await browser.newPage();
const { width, height } = getPrintViewportSize();
await page.setViewport({ width, height, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: "domcontentloaded", baseURL: `file://${root}/` });
const buf = await page.pdf(pdfOptions);
await browser.close();
await ensureParentDir(outPath);
await writeFile(outPath, buf);
console.log(`Wrote ${outPath} (${target.id})`);
