import { API_BASE_URL } from '../constants';

interface ApiOptions extends RequestInit {
  params?: Record<string, string | number | undefined>;
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: string[],
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

let accessToken: string | null = localStorage.getItem('accessToken');
let refreshToken: string | null = localStorage.getItem('refreshToken');

export function setTokens(access: string, refresh: string) {
  accessToken = access;
  refreshToken = refresh;
  localStorage.setItem('accessToken', access);
  localStorage.setItem('refreshToken', refresh);
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

export function getAccessToken() {
  return accessToken;
}

async function refreshAccessToken(): Promise<boolean> {
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    setTokens(data.data.accessToken, data.data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

export async function api<T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  const { params, ...fetchOptions } = options;

  let url = `${API_BASE_URL}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, String(value));
    });
    const queryString = searchParams.toString();
    if (queryString) url += `?${queryString}`;
  }

  const headers = new Headers(fetchOptions.headers as Record<string, string>);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  let response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (response.status === 401 && refreshToken) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      headers.set('Authorization', `Bearer ${accessToken}`);
      response = await fetch(url, {
        ...fetchOptions,
        headers,
      });
    }
  }

  const json = await response.json();

  if (!response.ok) {
    throw new ApiError(
      response.status,
      json.message ?? 'Error en la solicitud',
      json.errors,
    );
  }

  return json.data;
}

export function apiGet<T>(endpoint: string, params?: Record<string, string | number | undefined>) {
  return api<T>(endpoint, { method: 'GET', params });
}

export function apiPost<T>(endpoint: string, body?: unknown) {
  return api<T>(endpoint, { method: 'POST', body: body ? JSON.stringify(body) : undefined });
}

export function apiPatch<T>(endpoint: string, body?: unknown) {
  return api<T>(endpoint, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined });
}

export function apiPut<T>(endpoint: string, body?: unknown) {
  return api<T>(endpoint, { method: 'PUT', body: body ? JSON.stringify(body) : undefined });
}

export function apiDelete<T>(endpoint: string) {
  return api<T>(endpoint, { method: 'DELETE' });
}

export { ApiError };
