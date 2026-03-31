import { escapeHtml, escapeAttr, splitName, shortFluency, flattenSkills } from "./text-utils.mjs";
import { fmtRange } from "./dates.mjs";
import { getUi } from "./ui-labels.mjs";
import { resolveImageSrc } from "./image-resolver.mjs";
import { getCompactCvStylesheet } from "./load-styles.mjs";

/**
 * Génère le document HTML du CV compact (deux colonnes).
 * Réutilisable depuis la CI, une future SPA, ou des tests.
 *
 * @param {import('@jsonresume/schema').Resume} resume - Objet JSON Resume validé
 * @param {{ rootDir?: string }} [options]
 * @returns {Promise<string>}
 */
export async function buildCompactHtml(resume, { rootDir } = {}) {
  const css = await getCompactCvStylesheet();
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
          ui.locale === "fr" ? l.fluency : shortFluency(l.fluency, ui.locale);
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
      const inst = e.url
        ? `<a href="${escapeAttr(e.url)}">${escapeHtml(e.institution || "")}</a>`
        : escapeHtml(e.institution || "");
      return `<div class="grid-row">
  <div class="dates">${dateCol}</div>
  <div>
    <div class="edu-line">${escapeHtml(parts)}</div>
    <div class="edu-inst">${inst}</div>
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
  <style>${css}</style>
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
