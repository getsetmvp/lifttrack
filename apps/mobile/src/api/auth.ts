import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { LoginDto, SignupDto, User } from '@liftfuel/shared-types';
import { api } from '../lib/api';
import * as authLib from '../lib/auth';
import { qk } from './keys';
import { useAuthStore } from '../store/useAuthStore';

export function useMe() {
  const setUser = useAuthStore((s) => s.setUser);
  return useQuery({
    queryKey: qk.me,
    queryFn: async () => {
      const u = await api<User>('/auth/me');
      setUser(u);
      return u;
    },
    staleTime: 60_000,
  });
}

export function useSignUp() {
  const setUser = useAuthStore((s) => s.setUser);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: SignupDto) => {
      const u = await authLib.signUp(input);
      setUser(u);
      return u;
    },
    onSuccess: (u) => qc.setQueryData(qk.me, u),
  });
}

export function useSignIn() {
  const setUser = useAuthStore((s) => s.setUser);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: LoginDto) => {
      const u = await authLib.signIn(input);
      setUser(u);
      return u;
    },
    onSuccess: (u) => qc.setQueryData(qk.me, u),
  });
}

export function useSignOut() {
  const reset = useAuthStore((s) => s.reset);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await authLib.signOut();
      reset();
      qc.clear();
    },
  });
}
