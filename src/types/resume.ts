export interface PersonalInfo {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  nationality: string;
  summary: string;
  photoUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
  startDate: string;
  endDate: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
}

export interface Reference {
  id: string;
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
}

export interface ResumeData {
  id?: string;
  title: string;
  templateId: string;
  colorHex: string;
  fontFamily: string;
  personalInfo: PersonalInfo;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  projects: Project[];
  languages: Language[];
  certificates: Certificate[];
  references: Reference[];
  sectionOrder: string[];
}

export type TemplateId = 'modern' | 'professional' | 'minimal' | 'academic' | 'creative';

export const TEMPLATES: { id: TemplateId; name: string; description: string }[] = [
  { id: 'modern', name: 'Modern', description: 'Clean, bold headers with accent color sidebar' },
  { id: 'professional', name: 'Professional', description: 'Classic corporate style with subtle dividers' },
  { id: 'minimal', name: 'Minimal', description: 'Elegant simplicity with typography focus' },
  { id: 'academic', name: 'Academic', description: 'Structured layout for research and academia' },
  { id: 'creative', name: 'Creative', description: 'Unique layout with visual flair and personality' },
];

export const DEFAULT_SECTION_ORDER = [
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'languages',
  'certificates',
  'references',
];

export const FONT_OPTIONS = [
  { value: 'Inter, sans-serif', label: 'Inter' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Merriweather, serif', label: 'Merriweather' },
  { value: "'Playfair Display', serif", label: 'Playfair Display' },
  { value: "'Roboto Mono', monospace", label: 'Roboto Mono' },
];

export const COLOR_PRESETS = [
  '#4f46e5', // Indigo
  '#0891b2', // Cyan
  '#059669', // Emerald
  '#dc2626', // Red
  '#7c3aed', // Violet
  '#ea580c', // Orange
  '#0284c7', // Sky
  '#1e293b', // Slate
  '#be123c', // Rose
  '#15803d', // Green
];
