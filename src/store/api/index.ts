import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "..";

export const fetchBaseQueryWithReauth = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_LISTIFY_API_URL,
  prepareHeaders: (headers, api) => {
    const state = api.getState() as RootState & { auth?: { token?: string } };
    const token = state.auth?.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});
