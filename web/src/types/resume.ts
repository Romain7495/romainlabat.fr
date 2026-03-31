export type Locale = "en" | "fr";

export interface Basics {
  name?: string;
  label?: string;
  email?: string;
  summary?: string;
  location?: { city?: string; countryCode?: string };
  image?: string;
}

export interface WorkEntry {
  name?: string;
  position?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

export interface EducationEntry {
  institution?: string;
  url?: string;
  area?: string;
  studyType?: string;
  startDate?: string;
  endDate?: string;
}

export interface SkillCategory {
  name?: string;
  keywords?: string[];
}

export interface LanguageEntry {
  language?: string;
  fluency?: string;
}

export interface ResumeLabels {
  contact?: string;
  skills?: string;
  languages?: string;
  experience?: string;
  education?: string;
  present?: string;
}

export interface Resume {
  basics?: Basics;
  work?: WorkEntry[];
  education?: EducationEntry[];
  skills?: SkillCategory[];
  languages?: LanguageEntry[];
  meta?: { locale?: string; labels?: ResumeLabels };
}
