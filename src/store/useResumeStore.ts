import { create } from "zustand";
import {
  ResumeData,
  PersonalInfo,
  Experience,
  Education,
  Skill,
  Project,
  Language,
  Certificate,
  Reference,
  DEFAULT_SECTION_ORDER,
} from "@/types/resume";

interface ResumeStore {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;

  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  removeExperience: (id: string) => void;

  addEducation: (edu: Education) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  removeEducation: (id: string) => void;

  addSkill: (skill: Skill) => void;
  removeSkill: (id: string) => void;

  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;

  addLanguage: (lang: Language) => void;
  removeLanguage: (id: string) => void;

  addCertificate: (cert: Certificate) => void;
  updateCertificate: (id: string, cert: Partial<Certificate>) => void;
  removeCertificate: (id: string) => void;

  addReference: (ref: Reference) => void;
  updateReference: (id: string, ref: Partial<Reference>) => void;
  removeReference: (id: string) => void;

  updateSettings: (settings: Partial<Pick<ResumeData, 'templateId' | 'colorHex' | 'title' | 'fontFamily'>>) => void;
  setSectionOrder: (order: string[]) => void;
  toggleSection: (sectionId: string) => void;
}

const initialResumeData: ResumeData = {
  title: "Untitled CV",
  templateId: "modern",
  colorHex: "#4f46e5",
  fontFamily: "Inter, sans-serif",
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    nationality: "",
    summary: "",
  },
  experiences: [],
  educations: [],
  skills: [],
  projects: [],
  languages: [],
  certificates: [],
  references: [],
  sectionOrder: [...DEFAULT_SECTION_ORDER],
};

export const useResumeStore = create<ResumeStore>((set) => ({
  resumeData: initialResumeData,

  setResumeData: (data) => set({ resumeData: data }),

  updatePersonalInfo: (info) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        personalInfo: { ...state.resumeData.personalInfo, ...info },
      },
    })),

  // Experience
  addExperience: (exp) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        experiences: [...state.resumeData.experiences, exp],
      },
    })),

  updateExperience: (id, exp) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        experiences: state.resumeData.experiences.map((e) =>
          e.id === id ? { ...e, ...exp } : e
        ),
      },
    })),

  removeExperience: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        experiences: state.resumeData.experiences.filter((e) => e.id !== id),
      },
    })),

  // Education
  addEducation: (edu) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        educations: [...state.resumeData.educations, edu],
      },
    })),

  updateEducation: (id, edu) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        educations: state.resumeData.educations.map((e) =>
          e.id === id ? { ...e, ...edu } : e
        ),
      },
    })),

  removeEducation: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        educations: state.resumeData.educations.filter((e) => e.id !== id),
      },
    })),

  // Skills
  addSkill: (skill) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        skills: [...state.resumeData.skills, skill],
      },
    })),

  removeSkill: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        skills: state.resumeData.skills.filter((s) => s.id !== id),
      },
    })),

  // Projects
  addProject: (project) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        projects: [...state.resumeData.projects, project],
      },
    })),

  updateProject: (id, project) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        projects: state.resumeData.projects.map((p) =>
          p.id === id ? { ...p, ...project } : p
        ),
      },
    })),

  removeProject: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        projects: state.resumeData.projects.filter((p) => p.id !== id),
      },
    })),

  // Languages
  addLanguage: (lang) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        languages: [...state.resumeData.languages, lang],
      },
    })),

  removeLanguage: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        languages: state.resumeData.languages.filter((l) => l.id !== id),
      },
    })),

  // Certificates
  addCertificate: (cert) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        certificates: [...state.resumeData.certificates, cert],
      },
    })),

  updateCertificate: (id, cert) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        certificates: state.resumeData.certificates.map((c) =>
          c.id === id ? { ...c, ...cert } : c
        ),
      },
    })),

  removeCertificate: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        certificates: state.resumeData.certificates.filter((c) => c.id !== id),
      },
    })),

  // References
  addReference: (ref) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        references: [...state.resumeData.references, ref],
      },
    })),

  updateReference: (id, ref) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        references: state.resumeData.references.map((r) =>
          r.id === id ? { ...r, ...ref } : r
        ),
      },
    })),

  removeReference: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        references: state.resumeData.references.filter((r) => r.id !== id),
      },
    })),

  // Settings
  updateSettings: (settings) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        ...settings,
      },
    })),

  setSectionOrder: (order) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        sectionOrder: order,
      },
    })),

  toggleSection: (sectionId) =>
    set((state) => {
      const currentOrder = state.resumeData.sectionOrder;
      const newOrder = currentOrder.includes(sectionId)
        ? currentOrder.filter((s) => s !== sectionId)
        : [...currentOrder, sectionId];
      return {
        resumeData: {
          ...state.resumeData,
          sectionOrder: newOrder,
        },
      };
    }),
}));
