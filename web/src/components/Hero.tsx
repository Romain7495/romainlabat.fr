import { useTranslation } from "react-i18next";
import type { Basics, Locale } from "../types/resume";
import profilePhoto from "@assets/profile.png";

type Props = {
  basics: Basics;
  locale: Locale;
};

export function Hero({ basics, locale }: Props) {
  const { t } = useTranslation("common");
  const location = [basics.location?.city, basics.location?.countryCode].filter(Boolean).join(", ");
  const pdfName = `resume-${locale}.pdf`;
  const baseUrl = import.meta.env.BASE_URL;
  /* Dev : fichiers copiés dans web/public → servis à la racine du serveur Vite */
  const pdfHref = import.meta.env.DEV
    ? `/${pdfName}`
    : baseUrl === "./"
      ? `./${pdfName}`
      : `${baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`}${pdfName}`;

  return (
    <header className="hero reveal">
      <div className="hero-top">
        <img
          className="hero-photo"
          src={profilePhoto}
          width={96}
          height={96}
          alt={basics.name ?? ""}
        />
        <div className="hero-text">
          <p className="hero-eyebrow">{t("heroEyebrow")}</p>
          <h1>{basics.name}</h1>
          <p className="hero-role">{basics.label}</p>
          <ul className="hero-tags" aria-label="Focus">
            <li>{t("heroTagSre")}</li>
            <li>{t("heroTagK8s")}</li>
            <li>{t("heroTagGitOps")}</li>
            <li>{t("heroTagId")}</li>
          </ul>
        </div>
      </div>
      {basics.summary ? <p className="hero-summary">{basics.summary}</p> : null}
      <div className="hero-actions">
        <a
          className="btn btn-primary"
          href={pdfHref}
          download
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("downloadPdf")}
        </a>
        {basics.email ? (
          <a className="btn" href={`mailto:${basics.email}`}>
            {t("email")}
          </a>
        ) : null}
        {location ? (
          <span className="meta-line">
            <span>{t("locationLabel")}</span> {location}
          </span>
        ) : null}
      </div>
    </header>
  );
}
