import client from './client';

export interface AuthResponse {
  accessToken: string;
  user: { id: string; email: string; name: string | null };
}

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
}

export const login = (email: string, password: string) =>
  client.post<AuthResponse>('/auth/login', { email, password }).then((r) => r.data);

export const register = (email: string, password: string, name?: string) =>
  client.post<AuthResponse>('/auth/register', { email, password, name }).then((r) => r.data);

export const getMe = () =>
  client.get<UserProfile>('/auth/me').then((r) => r.data);
