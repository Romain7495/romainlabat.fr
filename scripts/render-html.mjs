import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { buildCompactHtml } from "./compact-render.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const lang = (process.argv[2] || "en").toLowerCase();
const isFr = lang === "fr" || lang === "french";
const resumeFile = isFr ? "resume.fr.json" : "resume.json";
const outFile = isFr ? "resume-fr.html" : "resume.html";

const resume = JSON.parse(await readFile(path.join(root, resumeFile), "utf-8"));
const html = await buildCompactHtml(resume, { rootDir: root });
await writeFile(path.join(root, outFile), html);
console.log(`Wrote ${path.join(root, outFile)} (${isFr ? "fr" : "en"})`);
