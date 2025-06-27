import { SPOTIFY_CONFIG } from "@/config/spotify-config";

const generateRandomString = (length: number) => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

// Generate PKCE code challenge and verifier for Spotify OAuth
// This implements the Proof Key for Code Exchange flow for security
export const generateCodeChallenge = async () => {
  const codeVerifier = generateRandomString(64);

  const sha256 = async (plain: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest("SHA-256", data);
  };

  const base64encode = (input: ArrayBuffer) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  };

  const codeChallenge = base64encode(await sha256(codeVerifier));

  return {
    codeChallenge,
    codeVerifier,
  };
};

// Build Spotify authorization URL with PKCE parameters
export const getAuthUrl = async (codeChallenge: string) => {
  const { CLIENT_ID, REDIRECT_URI, SCOPES } = SPOTIFY_CONFIG;

  const scope = SCOPES.join(" ");

  const url = new URL(SPOTIFY_CONFIG.AUTH_URL);

  url.searchParams.set("client_id", CLIENT_ID);
  url.searchParams.set("redirect_uri", REDIRECT_URI);
  url.searchParams.set("scope", scope);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("code_challenge", codeChallenge);

  return url.toString();
};
