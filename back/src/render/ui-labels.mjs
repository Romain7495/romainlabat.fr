const DEFAULT_LABELS = Object.freeze({
  contact: "Contact",
  skills: "Skills",
  languages: "Languages",
  experience: "Experience",
  education: "Education",
  present: "present",
});

export function getUi(resume) {
  const labels = { ...DEFAULT_LABELS, ...(resume.meta?.labels || {}) };
  const locale = resume.meta?.locale || "en";
  return { labels, locale };
}
