export type SearchFilters = {
  query: string;
  company?: string;
  city?: string;
  sector?: string;
  school?: string;
  startDate?: string;
  endDate?: string;
};

export const DEFAULT_SEARCH_FILTERS: SearchFilters = {
  query: "",
  company: "",
  city: "",
  sector: "",
  school: "",
  startDate: "",
  endDate: "",
};

export type Student = {
  id: string;
  fullName: string;
  headline: string;
  city: string;
  school: string;
  skills: string[];
  bio: string;
};

export type Company = {
  id: string;
  name: string;
  sector: string;
  city: string;
  logoUrl?: string;
  description: string;
};

export type Apprenticeship = {
  id: string;
  title: string;
  companyId: string;
  studentId?: string;
  location: string;
  startDate: string;
  endDate?: string;
};

export type SearchResponse = {
  students: Student[];
  companies: Company[];
  apprenticeships: Apprenticeship[];
};
