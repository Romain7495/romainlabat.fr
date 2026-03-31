import { useTranslation } from "react-i18next";
import type { LanguageEntry } from "../types/resume";

type Props = {
  labelsLanguages: string;
  languages: LanguageEntry[];
};

export function Footer({ labelsLanguages, languages }: Props) {
  const { t } = useTranslation("common");
  const langLine = languages
    .map((l) => [l.language, l.fluency].filter(Boolean).join(" · "))
    .join(" · ");

  return (
    <footer>
      <span>{t("footerNote")}</span>
      <p className="lang-row">
        {labelsLanguages}: {langLine}
      </p>
    </footer>
  );
}
