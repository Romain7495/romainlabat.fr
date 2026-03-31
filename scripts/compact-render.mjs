/**
 * Compact two-column layout aligned with the reference CV:
 * sidebar = name, photo, contact, skills, languages
 * main = summary, experience (dates left), education (dates left)
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

function escapeHtml(t) {
  if (t == null || t === "") return "";
  return String(t)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function splitName(full) {
  const parts = (full || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: "", last: "" };
  if (parts.length === 1) return { first: parts[0], last: "" };
  const last = parts.pop();
  return { first: parts.join(" "), last: last.toUpperCase() };
}

/** YYYY-MM -> MM/YYYY */
function fmtMY(ym) {
  if (!ym || typeof ym !== "string") return "";
  const [y, m] = ym.split("-");
  if (!y || !m) return ym;
  return `${m.padStart(2, "0")}/${y}`;
}

function fmtRange(start, end, presentWord = "present") {
  const a = fmtMY(start);
  const b = end ? fmtMY(end) : presentWord;
  return { start: a, end: b };
}

const DEFAULT_LABELS = {
  contact: "Contact",
  skills: "Skills",
  languages: "Languages",
  experience: "Experience",
  education: "Education",
  present: "present",
};

function getUi(resume) {
  const labels = { ...DEFAULT_LABELS, ...(resume.meta?.labels || {}) };
  const locale = resume.meta?.locale || "en";
  return { labels, locale };
}

async function resolveImageSrc(basics, rootDir) {
  const img = basics?.image;
  if (!img) return null;
  if (/^https?:\/\//i.test(img)) return img;
  if (!rootDir) return null;
  const p = path.isAbsolute(img) ? img : path.join(rootDir, img);
  try {
    const buf = await readFile(p);
    const ext = path.extname(p).toLowerCase();
    const mime =
      ext === ".png"
        ? "image/png"
        : ext === ".jpg" || ext === ".jpeg"
          ? "image/jpeg"
          : ext === ".webp"
            ? "image/webp"
            : "application/octet-stream";
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

function escapeAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function shortFluency(f, locale) {
  if (!f) return "";
  if (locale === "fr") {
    if (/maternelle|native|natif/i.test(f)) return "langue maternelle";
    if (/professionnel|courant|professional|full/i.test(f)) return "professionnel";
    return f.split(/\s+/).slice(0, 4).join(" ");
  }
  if (/native/i.test(f)) return "Native";
  if (/professional|full/i.test(f)) return "Professional";
  return f.split(/\s+/).slice(0, 2).join(" ");
}

function flattenSkills(skills) {
  const out = [];
  for (const s of skills || []) {
    for (const k of s.keywords || []) out.push(k);
  }
  return out;
}

const CSS = `
:root {
  /* Bleu bandeau demandé (échantillon utilisateur) */
  --sidebar-bg: #1a427a;
  /* Titres CONTACT / SKILLS : bleu un peu plus clair / plus vif que le fond */
  --sidebar-strip: #2a5f9e;
  --sidebar-fg: #f7f9fc;
  --main-bg: #ffffff;
  /* Corps en gris (pas noir pur) */
  --main-text: #3d3d3d;
  --heading-strong: #252525;
  --muted: #6a6a6a;
  --rule: #c5c5c5;
  --sec-heading: #141414;
  --sidebar-pad-x: 20px;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 12.5px; height: 100%; }
body {
  font-family: "Helvetica Neue", Helvetica, Arial, system-ui, sans-serif;
  color: var(--main-text);
  line-height: 1.48;
  background: var(--main-bg);
  margin: 0;
  min-height: 100%;
}
.cv {
  display: flex;
  align-items: stretch;
  min-height: 100vh;
  min-height: 100dvh;
  box-sizing: border-box;
}
.sidebar {
  width: 31%;
  max-width: 248px;
  min-width: 196px;
  flex-shrink: 0;
  align-self: stretch;
  background: var(--sidebar-bg);
  color: var(--sidebar-fg);
  padding: 26px var(--sidebar-pad-x) 24px;
  /* Étire le fond bleu sur toute la hauteur du flex parent */
  min-height: 100%;
}
.name-block { margin-bottom: 14px; }
.name-first {
  font-size: 1.75rem;
  font-weight: 600;
  line-height: 1.08;
  letter-spacing: 0.02em;
}
.name-last {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: 0.04em;
}
.job-title {
  font-size: 0.97rem;
  font-weight: 400;
  line-height: 1.4;
  opacity: 0.9;
  margin-top: 6px;
}
.photo-wrap {
  text-align: center;
  margin: 12px 0 16px;
}
.photo {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255,255,255,0.28);
}
/* Bandeaux de section : bleu plus clair que #1a427a */
.sh {
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.11em;
  margin: 16px calc(-1 * var(--sidebar-pad-x)) 12px;
  padding: 9px var(--sidebar-pad-x);
  background: var(--sidebar-strip);
  color: var(--sidebar-fg);
  border-bottom: none;
}
.sh:first-of-type {
  margin-top: 0;
}
.contact-line {
  font-size: 0.95rem;
  line-height: 1.52;
  margin: 7px 0;
  word-break: break-word;
}
.contact-line a { color: inherit; text-decoration: none; }
.skill-list, .lang-list {
  list-style: none;
  font-size: 0.95rem;
  line-height: 1.52;
}
.skill-list li, .lang-list li { margin: 5px 0; }
.main {
  flex: 1;
  align-self: stretch;
  padding: 30px 32px 28px 34px;
  background: var(--main-bg);
  min-width: 0;
  min-height: 100%;
}
.summary {
  font-size: 1.02rem;
  color: var(--muted);
  line-height: 1.6;
  margin-bottom: 18px;
  max-width: 58em;
}
h2.sec {
  font-size: 0.92rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--sec-heading);
  border-bottom: none;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 0;
  margin: 18px 0 14px;
}
h2.sec::after {
  content: "";
  flex: 1 1 auto;
  min-width: 12px;
  border-bottom: 1px solid var(--rule);
  transform: translateY(-2px);
}
main > h2.sec:first-of-type {
  margin-top: 0;
}
h2.sec + * { margin-top: 0; }
.grid-row {
  display: grid;
  grid-template-columns: 92px 1fr;
  gap: 8px 18px;
  align-items: start;
  margin-bottom: 17px;
  font-size: 0.94rem;
  color: var(--main-text);
}
.dates {
  color: var(--muted);
  font-size: 0.86rem;
  line-height: 1.48;
  white-space: nowrap;
  padding-top: 3px;
}
.role {
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--heading-strong);
  line-height: 1.38;
}
.company {
  font-weight: 600;
  font-size: 0.94rem;
  margin-top: 4px;
  color: #4a4a4a;
  line-height: 1.38;
}
.exp-sum {
  margin: 6px 0 5px;
  color: var(--muted);
  font-size: 0.92rem;
  line-height: 1.52;
  max-width: 56em;
}
ul.dots {
  margin: 3px 0 0;
  padding-left: 18px;
  font-size: 0.92rem;
  line-height: 1.5;
  color: var(--main-text);
}
ul.dots li { margin: 4px 0; }
.edu-line {
  font-weight: 600;
  font-size: 0.94rem;
  line-height: 1.45;
  color: var(--heading-strong);
}
.edu-inst { font-size: 0.92rem; color: var(--muted); margin-top: 4px; line-height: 1.45; }

@media print {
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  /*
   * Hauteur 100% : doit coïncider avec le viewport Puppeteer = A4 − marge bas
   * (voir export-pdf.mjs). Plus de hauteur en mm ici pour éviter le décalage px/mm.
   */
  html {
    font-size: 12px;
    height: 100%;
  }
  body {
    background: var(--main-bg);
    margin: 0;
    min-height: 100%;
    height: 100%;
  }
  .cv {
    display: flex !important;
    flex-direction: row;
    align-items: stretch !important;
    min-height: 100% !important;
    height: 100% !important;
    max-height: 100%;
    box-sizing: border-box;
  }
  .sidebar {
    float: none !important;
    width: 31%;
    max-width: 240px;
    min-width: 196px;
    min-height: 100% !important;
    height: 100% !important;
    align-self: stretch !important;
    padding: 24px var(--sidebar-pad-x) 18px !important;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .sidebar .sh {
    margin-left: calc(-1 * var(--sidebar-pad-x)) !important;
    margin-right: calc(-1 * var(--sidebar-pad-x)) !important;
    padding-left: var(--sidebar-pad-x) !important;
    padding-right: var(--sidebar-pad-x) !important;
  }
  .main {
    float: none !important;
    display: block;
    overflow: visible;
    flex: 1;
    min-height: 100% !important;
    height: 100% !important;
    align-self: stretch !important;
    padding: 26px 28px 20px 30px;
    box-sizing: border-box;
  }
  .grid-row { break-inside: avoid; page-break-inside: avoid; }
}
@page {
  size: A4;
  margin: 0;
}
`;

export async function buildCompactHtml(resume, { rootDir } = {}) {
  const ui = getUi(resume);
  const L = ui.labels;
  const b = resume.basics || {};
  const { first, last } = splitName(b.name);
  const loc = b.location || {};
  const city = loc.city || "";
  const country = loc.countryCode || "";
  const locationStr = [city, country].filter(Boolean).join(", ");

  const imageSrc = await resolveImageSrc(b, rootDir);

  const skills = flattenSkills(resume.skills);

  const contactBlock = [];
  if (b.email)
    contactBlock.push(
      `<div class="contact-line"><a href="mailto:${escapeHtml(b.email)}">${escapeHtml(b.email)}</a></div>`
    );
  if (locationStr)
    contactBlock.push(`<div class="contact-line">${escapeHtml(locationStr)}</div>`);
  if (b.phone) contactBlock.push(`<div class="contact-line">${escapeHtml(b.phone)}</div>`);

  const skillsHtml = skills.map((k) => `<li>${escapeHtml(k)}</li>`).join("");

  const langsHtml = (resume.languages || [])
    .map((l) => {
      let flu = "";
      if (l.fluency) {
        const t =
          ui.locale === "fr"
            ? l.fluency
            : shortFluency(l.fluency, ui.locale);
        flu = ` <span style="opacity:.85">· ${escapeHtml(t)}</span>`;
      }
      return `<li>${escapeHtml(l.language)}${flu}</li>`;
    })
    .join("");

  const workHtml = (resume.work || [])
    .map((w) => {
      const { start, end } = fmtRange(w.startDate, w.endDate, L.present);
      const dateCol = `${escapeHtml(start)}<br>—<br>${escapeHtml(end)}`;
      const highs = (w.highlights || [])
        .map((h) => `<li>${escapeHtml(h)}</li>`)
        .join("");
      const sum = w.summary
        ? `<p class="exp-sum">${escapeHtml(w.summary)}</p>`
        : "";
      return `<div class="grid-row">
  <div class="dates">${dateCol}</div>
  <div>
    <div class="role">${escapeHtml(w.position || "")}</div>
    <div class="company">${escapeHtml(w.name || "")}</div>
    ${sum}
    ${highs ? `<ul class="dots">${highs}</ul>` : ""}
  </div>
</div>`;
    })
    .join("");

  const eduHtml = (resume.education || [])
    .map((e) => {
      const { start, end } = fmtRange(e.startDate, e.endDate, L.present);
      const dateCol = `${escapeHtml(start)}<br>—<br>${escapeHtml(end)}`;
      const parts = [e.studyType, e.area].filter(Boolean).join(", ");
      return `<div class="grid-row">
  <div class="dates">${dateCol}</div>
  <div>
    <div class="edu-line">${escapeHtml(parts)}</div>
    <div class="edu-inst">${escapeHtml(e.institution || "")}</div>
  </div>
</div>`;
    })
    .join("");

  const photoHtml = imageSrc
    ? `<div class="photo-wrap"><img class="photo" src="${escapeAttr(imageSrc)}" alt="" /></div>`
    : "";

  const htmlLang = ui.locale === "fr" ? "fr" : "en";

  return `<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(b.name || "Resume")}</title>
  <style>${CSS}</style>
</head>
<body>
  <div class="cv">
    <aside class="sidebar">
      <div class="name-block">
        ${first ? `<div class="name-first">${escapeHtml(first)}</div>` : ""}
        ${last ? `<div class="name-last">${escapeHtml(last)}</div>` : ""}
        ${b.label ? `<div class="job-title">${escapeHtml(b.label)}</div>` : ""}
      </div>
      ${photoHtml}
      <div class="sh">${escapeHtml(L.contact)}</div>
      ${contactBlock.join("\n      ")}
      <div class="sh">${escapeHtml(L.skills)}</div>
      <ul class="skill-list">${skillsHtml}</ul>
      <div class="sh">${escapeHtml(L.languages)}</div>
      <ul class="lang-list">${langsHtml}</ul>
    </aside>
    <main class="main">
      ${b.summary ? `<p class="summary">${escapeHtml(b.summary)}</p>` : ""}
      <h2 class="sec">${escapeHtml(L.experience)}</h2>
      ${workHtml}
      <h2 class="sec">${escapeHtml(L.education)}</h2>
      ${eduHtml}
    </main>
  </div>
</body>
</html>`;
}
