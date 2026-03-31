import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import resumeEn from "@content/resume-en.json";
import resumeFr from "@content/resume-fr.json";
import type { Locale, Resume } from "../types/resume";

export function normalizeLocale(lng: string | undefined): Locale {
  if (!lng) return "en";
  return lng.toLowerCase().startsWith("fr") ? "fr" : "en";
}

export function useLocaleResume(): { locale: Locale; resume: Resume } {
  const { i18n } = useTranslation();
  const locale = normalizeLocale(i18n.resolvedLanguage ?? i18n.language);
  const resume = useMemo(
    () => (locale === "fr" ? resumeFr : resumeEn) as Resume,
    [locale]
  );
  return { locale, resume };
}
