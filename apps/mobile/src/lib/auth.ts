// Auth helpers — store/load JWT in expo-secure-store, sign-in/up/out flows.
// User shape per design.md § 12.

import type { AuthResponse, LoginDto, SignupDto, User } from '@liftfuel/shared-types';
import { api, setTokens, clearTokens, getAccessToken } from './api';

export type { User };

export async function signUp(input: SignupDto): Promise<User> {
  const data = await api<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  await setTokens(data.accessToken, data.refreshToken);
  return data.user;
}

export async function signIn(input: LoginDto): Promise<User> {
  const data = await api<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  await setTokens(data.accessToken, data.refreshToken);
  return data.user;
}

export async function signOut(): Promise<void> {
  try {
    await api<void>('/auth/logout', { method: 'POST' });
  } catch {
    // ignore — clear locally regardless
  }
  await clearTokens();
}

export async function me(): Promise<User> {
  return api<User>('/auth/me');
}

export async function isAuthed(): Promise<boolean> {
  return (await getAccessToken()) !== null;
}
