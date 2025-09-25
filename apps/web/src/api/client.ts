import type { AuthSession, LoginResponse } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';
const AUTH_STORAGE_KEY = 'networking-app:auth-session';
const ACCESS_TOKEN_SKEW_MS = 30_000;
const REFRESH_TOKEN_SKEW_MS = 30_000;

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type JsonBody = Record<string, unknown> | Array<unknown>;

let authSession: AuthSession | null = null;
const subscribers = new Set<(session: AuthSession | null) => void>();
let refreshPromise: Promise<AuthSession | null> | null = null;

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function resolveUrl(endpoint: string): string {
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
  return new URL(endpoint.replace(/^\//, ''), baseUrl).toString();
}

function isExpired(dateIso: string, skewMs: number): boolean {
  return new Date(dateIso).getTime() <= Date.now() + skewMs;
}

function loadSessionFromStorage(): AuthSession | null {
  if (!isBrowser()) {
    return null;
  }

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as AuthSession;
    if (
      !parsed?.accessToken ||
      !parsed?.accessTokenExpiresAt ||
      !parsed?.refreshToken ||
      !parsed?.refreshTokenExpiresAt ||
      !parsed?.tokenType ||
      !parsed?.user
    ) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    if (isExpired(parsed.refreshTokenExpiresAt, REFRESH_TOKEN_SKEW_MS)) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

function persistSession(session: AuthSession | null): AuthSession | null {
  authSession = session;

  if (isBrowser()) {
    if (session) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  notifySubscribers();
  return authSession;
}

function notifySubscribers(): void {
  const current = authSession;
  for (const subscriber of subscribers) {
    subscriber(current);
  }
}

function getOrLoadSession(): AuthSession | null {
  if (!authSession) {
    authSession = loadSessionFromStorage();
  }

  if (authSession && isExpired(authSession.refreshTokenExpiresAt, REFRESH_TOKEN_SKEW_MS)) {
    authSession = null;
    persistSession(null);
  }

  return authSession;
}

export function getAuthSession(): AuthSession | null {
  return getOrLoadSession();
}

export function saveAuthSession(response: LoginResponse): AuthSession {
  const session: AuthSession = {
    accessToken: response.accessToken,
    accessTokenExpiresAt: response.accessTokenExpiresAt,
    refreshToken: response.refreshToken,
    refreshTokenExpiresAt: response.refreshTokenExpiresAt,
    tokenType: response.tokenType,
    user: response.user,
  };

  return persistSession(session)!;
}

export function clearAuthSession(): void {
  persistSession(null);
}

export function subscribeAuthSession(listener: (session: AuthSession | null) => void): () => void {
  subscribers.add(listener);
  listener(getAuthSession());

  return () => {
    subscribers.delete(listener);
  };
}

function withJsonBody(body: JsonBody | undefined, init: RequestInit = {}): RequestInit {
  if (body === undefined) {
    return init;
  }

  const headers = new Headers(init.headers ?? {});
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return {
    ...init,
    headers,
    body: JSON.stringify(body),
  };
}

function isAccessTokenExpired(session: AuthSession): boolean {
  return isExpired(session.accessTokenExpiresAt, ACCESS_TOKEN_SKEW_MS);
}

function isRefreshTokenExpired(session: AuthSession): boolean {
  return isExpired(session.refreshTokenExpiresAt, REFRESH_TOKEN_SKEW_MS);
}

async function ensureFreshSession(): Promise<AuthSession | null> {
  const session = getAuthSession();
  if (!session) {
    return null;
  }

  if (!isAccessTokenExpired(session)) {
    return session;
  }

  if (isRefreshTokenExpired(session)) {
    clearAuthSession();
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = refreshSession(session.refreshToken);
  }

  return await refreshPromise;
}

async function refreshSession(refreshToken: string): Promise<AuthSession | null> {
  try {
    const response = await fetch(resolveUrl('auth/refresh'), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error(`Refresh failed with status ${response.status}`);
    }

    const data = (await response.json()) as LoginResponse;
    return saveAuthSession(data);
  } catch {
    clearAuthSession();
    return null;
  } finally {
    refreshPromise = null;
  }
}

async function request<T>(endpoint: string, init: RequestInit = {}, attempt = 0): Promise<T> {
  if (!refreshPromise) {
    await ensureFreshSession();
  } else {
    await refreshPromise;
  }

  const headers = new Headers(init.headers ?? {});
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  const session = getAuthSession();
  if (session) {
    headers.set('Authorization', `${session.tokenType} ${session.accessToken}`);
  }

  const response = await fetch(resolveUrl(endpoint), {
    ...init,
    headers,
  });

  if ((response.status === 401 || response.status === 403) && attempt === 0) {
    const currentSession = getAuthSession();
    if (currentSession && !isRefreshTokenExpired(currentSession)) {
      if (!refreshPromise) {
        refreshPromise = refreshSession(currentSession.refreshToken);
      }
      const refreshed = await refreshPromise;
      if (refreshed) {
        return request<T>(endpoint, init, attempt + 1);
      }
    }
    clearAuthSession();
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const data = (await response.json()) as Record<string, unknown> | undefined;
      if (data && typeof data === 'object' && typeof (data as { message?: unknown }).message === 'string') {
        message = (data as { message: string }).message;
      }
    } catch {
      const text = await response.text();
      if (text) {
        message = text;
      }
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

function createMethod(method: RequestMethod) {
  return function <TResponse, TBody = JsonBody>(endpoint: string, body?: TBody, init?: RequestInit) {
    return request<TResponse>(endpoint, withJsonBody(body as JsonBody | undefined, { ...(init ?? {}), method }));
  };
}

export const apiClient = {
  get: request,
  post: createMethod('POST'),
};
