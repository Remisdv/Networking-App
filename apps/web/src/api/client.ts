const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type JsonBody = Record<string, unknown> | Array<unknown>;

async function request<T>(endpoint: string, init: RequestInit = {}): Promise<T> {
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
  const url = new URL(endpoint.replace(/^\//, ''), baseUrl);

  const headers = new Headers(init.headers ?? {});
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  const response = await fetch(url.toString(), {
    ...init,
    headers,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const data = await response.json();
      message = typeof data?.message === 'string' ? data.message : message;
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

function createMethod(method: RequestMethod) {
  return function <TResponse, TBody = JsonBody>(endpoint: string, body?: TBody, init?: RequestInit) {
    return request<TResponse>(
      endpoint,
      withJsonBody(body as JsonBody | undefined, { ...(init ?? {}), method }),
    );
  };
}

export const apiClient = {
  get: request,
  post: createMethod('POST'),
};
