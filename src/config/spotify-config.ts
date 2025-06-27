export const SPOTIFY_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
  REDIRECT_URI: import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
  SCOPES: ["user-read-private", "user-read-email"],
  AUTH_URL: import.meta.env.VITE_SPOTIFY_AUTH_URL,
  TOKEN_URL: import.meta.env.VITE_SPOTIFY_TOKEN_URL,
  API_URL: import.meta.env.VITE_SPOTIFY_API_URL,
};
