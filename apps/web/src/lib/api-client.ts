import type { SearchFilters, SearchResponse, Student, Company } from "./types";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:3000";

function toQueryString(filters: Record<string, unknown>): string {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    params.append(key, String(value));
  });

  return params.toString();
}

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${input}`;
  const response = await fetch(url, {
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function searchPublicDirectory(filters: SearchFilters): Promise<SearchResponse> {
  const query = toQueryString({
    query: filters.query,
    company: filters.company,
    city: filters.city,
    sector: filters.sector,
    school: filters.school,
    startDate: filters.startDate,
    endDate: filters.endDate,
  });

  const endpoint = query ? `/public/search?${query}` : "/public/search";

  return request<SearchResponse>(endpoint);
}

export async function fetchStudent(id: string): Promise<Student> {
  return request<Student>(`/public/students/${id}`);
}

export async function fetchCompany(id: string): Promise<Company> {
  return request<Company>(`/public/companies/${id}`);
}

export async function createSession(idToken: string): Promise<void> {
  await request<void>("/auth/session", {
    method: "POST",
    body: JSON.stringify({ idToken }),
  });
}


