import { fmtJobRange } from "../utils/dates";
import type { WorkEntry } from "../types/resume";

type Props = {
  title: string;
  present: string;
  entries: WorkEntry[];
};

function OrgName({ w }: { w: WorkEntry }) {
  const name = w.name ?? "";
  if (w.url) {
    return (
      <a href={w.url} rel="noopener noreferrer">
        {name}
      </a>
    );
  }
  return <>{name}</>;
}

export function ExperienceSection({ title, present, entries }: Props) {
  return (
    <section aria-labelledby="exp-title">
      <h2 id="exp-title">{title}</h2>
      <ol className="timeline">
        {entries.map((w, i) => (
          <li key={`${w.name}-${w.startDate}-${i}`}>
            <div className="job-card">
              <div className="job-head">
                <span className="job-org">
                  <OrgName w={w} />
                </span>
                <span className="job-dates">{fmtJobRange(w.startDate, w.endDate, present)}</span>
              </div>
              {w.position ? <p className="job-title">{w.position}</p> : null}
              {w.summary ? <p className="job-summary">{w.summary}</p> : null}
              {w.highlights?.length ? (
                <ul className="job-highlights">
                  {w.highlights.map((h, j) => (
                    <li key={j}>{h}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
