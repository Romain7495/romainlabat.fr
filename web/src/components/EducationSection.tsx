import { fmtEduRange } from "../utils/dates";
import type { EducationEntry } from "../types/resume";

type Props = {
  title: string;
  entries: EducationEntry[];
};

function School({ e }: { e: EducationEntry }) {
  const name = e.institution ?? "";
  if (e.url) {
    return (
      <a href={e.url} target="_blank" rel="noopener noreferrer">
        {name}
      </a>
    );
  }
  return <>{name}</>;
}

export function EducationSection({ title, entries }: Props) {
  return (
    <section aria-labelledby="edu-title">
      <h2 id="edu-title">{title}</h2>
      <ul className="edu-list">
        {entries.map((e, i) => {
          const detail = [e.studyType, e.area].filter(Boolean).join(" · ");
          return (
            <li key={`${e.institution}-${i}`}>
              <span className="edu-school">
                <School e={e} />
              </span>
              <span className="edu-detail">{detail}</span>
              <span className="edu-dates">{fmtEduRange(e.startDate, e.endDate)}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
