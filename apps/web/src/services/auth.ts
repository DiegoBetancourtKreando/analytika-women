import { apiPost, apiGet, setTokens, clearTokens } from './api';
import type { AuthResponse, LoginInput, RegisterInput, User } from '@analytika/types';

export async function login(input: LoginInput): Promise<AuthResponse> {
  const data = await apiPost<any>('/auth/login', input);
  setTokens(data.accessToken, data.refreshToken);
  return {
    user: data.user,
    tokens: {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn,
    },
  };
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const data = await apiPost<any>('/auth/register', input);
  setTokens(data.accessToken, data.refreshToken);
  return {
    user: data.user,
    tokens: {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn,
    },
  };
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
