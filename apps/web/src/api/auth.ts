import { apiClient } from './client';

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
}

export interface RegisteredUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterResponse {
  user: RegisteredUser;
}

export function registerUser(payload: RegisterPayload) {
  return apiClient.post<RegisterResponse, RegisterPayload>('/auth/register', payload);
}
