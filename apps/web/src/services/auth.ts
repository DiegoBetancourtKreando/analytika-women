import { apiPost, apiGet, setTokens, clearTokens } from './api';
import type { AuthResponse, LoginInput, RegisterInput, User } from '@analytika/types';

export async function login(input: LoginInput): Promise<AuthResponse> {
  const data = await apiPost<AuthResponse>('/auth/login', input);
  setTokens(data.tokens.accessToken, data.tokens.refreshToken);
  return data;
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const data = await apiPost<AuthResponse>('/auth/register', input);
  setTokens(data.tokens.accessToken, data.tokens.refreshToken);
  return data;
}

export async function getMe(): Promise<User> {
  return apiGet<User>('/auth/me');
}

export async function logout(): Promise<void> {
  try {
    await apiPost('/auth/logout');
  } finally {
    clearTokens();
  }
}

export async function refreshSession(refreshToken: string): Promise<AuthResponse> {
  return apiPost<AuthResponse>('/auth/refresh', { refreshToken });
}
