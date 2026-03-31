export function escapeHtml(t) {
  if (t == null || t === "") return "";
  return String(t)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function escapeAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

export function splitName(full) {
  const parts = (full || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: "", last: "" };
  if (parts.length === 1) return { first: parts[0], last: "" };
  const last = parts.pop();
  return { first: parts.join(" "), last: last.toUpperCase() };
}

export function shortFluency(f, locale) {
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

export function flattenSkills(skills) {
  const out = [];
  for (const s of skills || []) {
    for (const k of s.keywords || []) out.push(k);
  }
  return out;
}
