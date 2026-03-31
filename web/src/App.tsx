import { useEffect } from "react";
import { EducationSection } from "./components/EducationSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { LangSwitch } from "./components/LangSwitch";
import { SkillsSection } from "./components/SkillsSection";
import { useLocaleResume } from "./hooks/useLocaleResume";

export default function App() {
  const { locale, resume } = useLocaleResume();
  const L = resume.meta?.labels ?? {};

  useEffect(() => {
    const lang = locale === "fr" ? "fr" : "en";
    document.documentElement.lang = lang;
    const b = resume.basics;
    if (b?.name && b?.label) {
      document.title = `${b.name} · ${b.label}`;
    }
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    if (b?.summary) {
      meta.setAttribute("content", b.summary);
    }
  }, [locale, resume]);

  const basics = resume.basics ?? {};

  return (
    <div className="wrap">
      <div className="top-bar">
        <LangSwitch />
      </div>
      <Hero basics={basics} locale={locale} />
      <ExperienceSection
        title={L.experience ?? "Experience"}
        present={L.present ?? "present"}
        entries={resume.work ?? []}
      />
      <SkillsSection title={L.skills ?? "Skills"} categories={resume.skills ?? []} />
      <EducationSection title={L.education ?? "Education"} entries={resume.education ?? []} />
      <Footer labelsLanguages={L.languages ?? "Languages"} languages={resume.languages ?? []} />
    </div>
  );
}
