export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  graduationYear: number;
  skills: string[];
}

export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  website?: string;
  description?: string;
  location?: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  location: string;
  contractType: string;
  weeklyHours?: number;
  salaryRange?: string;
  tags: string[];
  companyId: string;
  company: Company;
}
