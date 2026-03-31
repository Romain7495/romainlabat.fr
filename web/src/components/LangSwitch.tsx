import { useTranslation } from "react-i18next";
import { normalizeLocale } from "../hooks/useLocaleResume";

export function LangSwitch() {
  const { t, i18n } = useTranslation("common");
  const active = normalizeLocale(i18n.resolvedLanguage ?? i18n.language);

  return (
    <div className="lang-switch" role="group" aria-label={t("langSwitch")}>
      <span className="lang-label" id="lang-label">
        {t("language")}
      </span>
      <div className="lang-btns" aria-labelledby="lang-label">
        <button
          type="button"
          aria-pressed={active === "en"}
          onClick={() => {
            void i18n.changeLanguage("en");
          }}
        >
          {t("langEn")}
        </button>
        <button
          type="button"
          aria-pressed={active === "fr"}
          onClick={() => {
            void i18n.changeLanguage("fr");
          }}
        >
          {t("langFr")}
        </button>
      </div>
    </div>
  );
}
