import type { StateCreator } from 'zustand';

export interface UserState {
  user: {
    auth: boolean;
    isLoading: boolean;
    error: { code: string; message: string };
    data: { email: string; displayName: string };
  };
  loginUser: (params: { email: string; password: string }) => Promise<void>;
}

export const createUserSlice: StateCreator<UserState> = (set) => ({
  user: {
    auth: false,
    isLoading: false,
    error: { code: '', message: '' },
    data: { email: '', displayName: '' },
  },
  loginUser: async ({ email }) => {
    try {
      console.warn('Auth not configured — login disabled', { email });
      set((s) => ({
        user: {
          ...s.user,
          auth: false,
          error: { code: 'auth/not-configured', message: 'Authentication provider not configured' },
        },
      }));
    } catch (err: any) {
      const { code, message } = err;
      set((s) => ({
        user: { ...s.user, auth: false, error: { code, message } },
      }));
    }
  },
});
