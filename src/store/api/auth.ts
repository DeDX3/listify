import type { User } from "@/types/user.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_LISTIFY_API_URL}`,
  }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (user: Omit<User, "_id">) => ({
        url: "/auth/register",
        method: "POST",
        body: user,
      }),
    }),
    login: builder.mutation({
      query: ({ email, password }: { email: string; password: string }) => ({
        url: "/auth/login",
        method: "POST",
        body: { email, password },
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation } = authApi;
