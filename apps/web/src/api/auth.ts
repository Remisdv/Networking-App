import { apiClient, clearAuthSession, saveAuthSession } from './client';
import type { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from './types';

export { type RegisteredUser } from './types';

export function registerUser(payload: RegisterPayload) {
  return apiClient.post<RegisterResponse, RegisterPayload>('/auth/register', payload);
}

export async function loginUser(payload: LoginPayload) {
  const response = await apiClient.post<LoginResponse, LoginPayload>('/auth/login', payload);
  saveAuthSession(response);
  return response;
}

export function logoutUser() {
  clearAuthSession();
}
