import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { cookieHybridStorage } from "@/utils/cookieTokenStorage";
import { SPOTIFY_CONFIG } from "@/config/spotify-config";
import { errorHandler } from "@/utils/errorHandler";

const tokenStorage = cookieHybridStorage;

// Refresh access token using refresh token when current token expires
const refreshToken = async () => {
  const refreshTokenValue = tokenStorage.getRefreshToken();

  if (!refreshTokenValue) {
    throw new Error("No refresh token available");
  }

  const response = await fetch(SPOTIFY_CONFIG.TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshTokenValue,
      client_id: SPOTIFY_CONFIG.CLIENT_ID,
    }).toString(),
  });

  const data = await response.json();

  if (response.ok && data.access_token) {
    tokenStorage.setTokens(
      data.access_token,
      data.refresh_token || refreshTokenValue,
      data.expires_in
    );
  } else {
    throw new Error("Failed to refresh token");
  }
};

// Base query with automatic token refresh and header management
const spotifyBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_SPOTIFY_API_URL,
  prepareHeaders: async (headers) => {
    let token = tokenStorage.getAccessToken();
    let isExpired = tokenStorage.isExpired();

    // Automatically refresh token if expired and refresh token is available
    if ((!token || isExpired) && tokenStorage.hasRefreshToken()) {
      try {
        await refreshToken();
        token = tokenStorage.getAccessToken();
        isExpired = tokenStorage.isExpired();
      } catch (error) {
        errorHandler.logError(error as Error, "TokenRefresh");
      }
    }

    // Add authorization header only if we have a valid token
    if (token && !isExpired) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

// Wrapper to handle 401 errors by attempting token refresh
const spotifyBaseQueryWithReauth = async (
  args: any,
  api: any,
  extraOptions: any
) => {
  let result = await spotifyBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    try {
      await refreshToken();
      result = await spotifyBaseQuery(args, api, extraOptions);
    } catch (error) {
      tokenStorage.clear();
      window.location.href = "/auth/login";
    }
  }

  return result;
};

export const spotifyApi = createApi({
  reducerPath: "spotifyApi",
  baseQuery: spotifyBaseQueryWithReauth,
  tagTypes: ["SpotifyAuth"],
  endpoints: (builder) => ({
    exchangeCodeForToken: builder.mutation<
      { access_token: string; refresh_token: string; expires_in: number },
      string
    >({
      query: (code) => ({
        url: SPOTIFY_CONFIG.TOKEN_URL,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: SPOTIFY_CONFIG.REDIRECT_URI,
          client_id: SPOTIFY_CONFIG.CLIENT_ID,
          code_verifier: localStorage.getItem("spotify_code_verifier") || "",
        }).toString(),
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          cookieHybridStorage.setTokens(
            data.access_token,
            data.refresh_token,
            data.expires_in
          );
          localStorage.removeItem("spotify_code_verifier");
        } catch (error) {
          errorHandler.logError(error as Error, "TokenExchange");
        }
      },
    }),

    getCurrentUser: builder.query<any, void>({
      query: () => "me",
      providesTags: ["SpotifyAuth"],
    }),

    getUserPlaylists: builder.query<any, void>({
      query: () => "me/playlists",
      providesTags: ["SpotifyAuth"],
    }),

    searchTracks: builder.query<{ tracks: { items: any[] } }, string>({
      query: (query) => ({
        url: "search",
        params: {
          q: query,
          type: "track",
          limit: 10,
        },
      }),
      providesTags: ["SpotifyAuth"],
    }),
  }),
});

export const {
  useExchangeCodeForTokenMutation,
  useGetCurrentUserQuery,
  useGetUserPlaylistsQuery,
  useSearchTracksQuery,
} = spotifyApi;
