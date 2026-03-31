import { useTranslation } from "react-i18next";

export function DevModeBanner() {
  const { t } = useTranslation("common");
  if (!import.meta.env.DEV) return null;

  return (
    <div className="dev-banner" role="status" aria-live="polite">
      <div className="dev-banner-strip" />
      <div className="dev-banner-inner">
        <strong className="dev-banner-title">{t("devBannerTitle")}</strong>
        <span className="dev-banner-sub">{t("devBannerSubtitle")}</span>
      </div>
    </div>
  );
}
