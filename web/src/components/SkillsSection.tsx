import type { SkillCategory } from "../types/resume";

type Props = {
  title: string;
  categories: SkillCategory[];
};

export function SkillsSection({ title, categories }: Props) {
  return (
    <section aria-labelledby="skills-title">
      <h2 id="skills-title">{title}</h2>
      <div className="skill-grid">
        {categories.map((s, i) => (
          <div className="skill-block" key={`${s.name}-${i}`}>
            {s.name ? <h3>{s.name}</h3> : null}
            <div className="skill-tags">
              {(s.keywords ?? []).map((k, j) => (
                <span key={`${k}-${j}`}>{k}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
