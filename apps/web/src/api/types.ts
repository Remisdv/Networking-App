export interface RegisteredUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
}

export interface RegisterResponse {
  user: RegisteredUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  user: RegisteredUser;
}

export interface AuthSession {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  tokenType: 'Bearer';
  user: RegisteredUser;
}

export interface CompanySummary {
  id: string;
  name: string;
  industry: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  location: string;
  contractType: string;
  tags: string[];
  company: CompanySummary;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  graduationYear: number;
  skills: string[];
  createdAt: string;
  updatedAt: string;
}
