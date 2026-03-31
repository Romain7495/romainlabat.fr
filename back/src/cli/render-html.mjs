import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getProjectRoot } from "../lib/paths.mjs";
import { resolveBuildTarget } from "../lib/build-target.mjs";
import { ensureParentDir } from "../lib/ensure-dir.mjs";
import { buildCompactHtml } from "../render/html-document.mjs";

const root = getProjectRoot(import.meta.url);
const target = resolveBuildTarget(process.argv[2]);
const resumePath = path.join(root, target.resumeFile);
const outPath = path.join(root, target.htmlFile);

const resume = JSON.parse(await readFile(resumePath, "utf-8"));
const html = await buildCompactHtml(resume, { rootDir: root });
await ensureParentDir(outPath);
await writeFile(outPath, html);
console.log(`Wrote ${outPath} (${target.id})`);
