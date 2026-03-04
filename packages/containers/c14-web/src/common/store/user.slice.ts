import { createSlice } from '@reduxjs/toolkit';
import type { AppThunk } from './common';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    auth: false,
    isLoading: false,
    error: {
      code: '',
      message: '',
    },
    data: {
      email: '',
      displayName: '',
    },
  },
  reducers: {
    userLoginStart(state, _action) {
      state.error = { code: '', message: '' };
      state.isLoading = true;
      state.auth = false;
    },
    userLoginSucess(state, _action) {
      state.error = { code: '', message: '' };
      state.isLoading = false;
      state.auth = true;
    },
    userLoginFailed(state, action) {
      const { code, message } = action.payload;
      state.error.code = code;
      state.error.message = message;
      state.auth = false;
    },
  },
});

export const { userLoginSucess, userLoginFailed } = userSlice.actions;
export const userReducer = userSlice.reducer;

// Firebase auth removed — login is a no-op until auth provider is replaced
export const loginUser =
  ({ email, password }: { email: string; password: string }): AppThunk =>
  async (dispatch) => {
    try {
      // TODO: Replace with Supabase or other auth provider
      console.warn('Auth not configured — login disabled', { email });
      dispatch(
        userLoginFailed({
          code: 'auth/not-configured',
          message: 'Authentication provider not configured',
        })
      );
    } catch (err: any) {
      const { code, message } = err;
      dispatch(userLoginFailed({ code, message }));
    }
  };
