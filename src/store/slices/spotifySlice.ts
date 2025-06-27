import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface SpotifyState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  isAuthenticated: boolean;
}

const initialState: SpotifyState = {
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
  isAuthenticated: false,
};

const spotifySlice = createSlice({
  name: "spotify",
  initialState,
  reducers: {
    setTokens: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.expiresAt = Date.now() + action.payload.expiresIn * 1000;
      state.isAuthenticated = true;
    },
    updateAccessToken: (
      state,
      action: PayloadAction<{
        accessToken: string;
        expiresIn: number;
        refreshToken?: string;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.expiresAt = Date.now() + action.payload.expiresIn * 1000;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
      state.isAuthenticated = true;
    },
    clearTokens: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.expiresAt = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setTokens, updateAccessToken, clearTokens } =
  spotifySlice.actions;
export default spotifySlice.reducer;
