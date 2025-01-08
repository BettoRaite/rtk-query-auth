import type { User } from "@/lib/types/auth";
import type { RootState } from "@/store/store";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AuthState = "unauthenticated" | "loading" | "authenticated" | "idle";
type InitialAuthSliceState = {
  user: User | null;
  accessToken: string | null;
  authState: AuthState;
  error: null | string;
};

const initialState: InitialAuthSliceState = {
  user: null,
  accessToken: null,
  authState: "idle",
  error: null,
};
export const userSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    clearState: (state) => {
      state.authState = "idle";
      state.error = null;
      state.accessToken = null;
      state.user = null;
    },
    clearAuth: (state) => {
      state.authState = "idle";
      state.error = null;
      state.accessToken = null;
      state.user = null;
    },
    setAuth: (
      state,
      { payload }: PayloadAction<Partial<InitialAuthSliceState>>
    ) => {
      const {
        accessToken = state.accessToken,
        authState = state.authState,
        error = state.error,
        user = state.user,
      } = payload;
      state.authState = authState;
      state.error = error;
      state.accessToken = accessToken;
      state.user = user;
    },
  },
});

export const { clearState, setAuth, clearAuth } = userSlice.actions;
export const authSelector = (state: RootState) => state.auth;
