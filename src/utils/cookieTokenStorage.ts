import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import { errorHandler } from "./errorHandler";

// Generate a secure encryption key
const getEncryptionKey = (): string => {
  const appKey = import.meta.env.VITE_ENCRYPTION_KEY;
  const userAgent = navigator.userAgent;
  const domain = window.location.hostname;

  return CryptoJS.SHA256(appKey + userAgent + domain).toString();
};

// Encrypt token using AES
const encryptToken = (token: string): string => {
  const key = getEncryptionKey();
  return CryptoJS.AES.encrypt(token, key).toString();
};

// Decrypt token using AES
const decryptToken = (encryptedToken: string): string | null => {
  try {
    const key = getEncryptionKey();
    const bytes = CryptoJS.AES.decrypt(encryptedToken, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    errorHandler.logError(error as Error, "TokenDecryption");
    return null;
  }
};

// Cookie configuration
const COOKIE_CONFIG = {
  expires: 30, // 30 days
  secure: import.meta.env.PROD, // HTTPS only in production
  sameSite: "strict" as const, // CSRF protection
  path: "/", // Available across the app
};

// Cookie-based token storage
export const cookieTokenStorage = {
  setAccessToken: (token: string) => {
    const encrypted = encryptToken(token);
    Cookies.set("spotify_access_token", encrypted, COOKIE_CONFIG);
  },

  getAccessToken: (): string | null => {
    const encrypted = Cookies.get("spotify_access_token");
    if (!encrypted) return null;
    return decryptToken(encrypted);
  },

  setRefreshToken: (token: string) => {
    const encrypted = encryptToken(token);
    Cookies.set("spotify_refresh_token", encrypted, COOKIE_CONFIG);
  },

  getRefreshToken: (): string | null => {
    const encrypted = Cookies.get("spotify_refresh_token");
    if (!encrypted) return null;
    return decryptToken(encrypted);
  },

  setExpiry: (expiresAt: number) => {
    const encrypted = encryptToken(expiresAt.toString());
    Cookies.set("spotify_expires_at", encrypted, COOKIE_CONFIG);
  },

  getExpiry: (): number | null => {
    const encrypted = Cookies.get("spotify_expires_at");
    if (!encrypted) return null;
    const decrypted = decryptToken(encrypted);
    return decrypted ? parseInt(decrypted) : null;
  },

  clear: () => {
    Cookies.remove("spotify_access_token", { path: "/" });
    Cookies.remove("spotify_refresh_token", { path: "/" });
    Cookies.remove("spotify_expires_at", { path: "/" });
  },

  isExpired: function (): boolean {
    const expiry = this.getExpiry();
    if (!expiry) return true;
    // 5 minute buffer
    return Date.now() > expiry - 5 * 60 * 1000;
  },

  hasTokens: function (): boolean {
    return !!(this.getAccessToken() && this.getRefreshToken());
  },
};

// Memory storage for temporary access tokens
class MemoryTokenStorage {
  private accessToken: string | null = null;
  private expiresAt: number | null = null;

  setTokens(accessToken: string, expiresIn: number) {
    this.accessToken = accessToken;
    this.expiresAt = Date.now() + expiresIn * 1000;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getExpiry(): number | null {
    return this.expiresAt;
  }

  isExpired(): boolean {
    if (!this.expiresAt) return true;
    return Date.now() > this.expiresAt - 5 * 60 * 1000;
  }

  clear() {
    this.accessToken = null;
    this.expiresAt = null;
  }

  hasTokens(): boolean {
    return !!this.accessToken;
  }
}

export const memoryTokenStorage = new MemoryTokenStorage();

// Hybrid storage strategy: access tokens in memory,
// refresh tokens in encrypted cookies
export const cookieHybridStorage = {
  setTokens: (accessToken: string, refreshToken: string, expiresIn: number) => {
    memoryTokenStorage.setTokens(accessToken, expiresIn);
    cookieTokenStorage.setRefreshToken(refreshToken);
    cookieTokenStorage.setExpiry(Date.now() + expiresIn * 1000);
  },

  getAccessToken: () => memoryTokenStorage.getAccessToken(),

  getRefreshToken: () => cookieTokenStorage.getRefreshToken(),

  getExpiry: () => memoryTokenStorage.getExpiry(),

  isExpired: () => memoryTokenStorage.isExpired(),

  clear: () => {
    memoryTokenStorage.clear();
    cookieTokenStorage.clear();
  },

  // Check if we have a refresh token available (for session restoration)
  hasRefreshToken: () => !!cookieTokenStorage.getRefreshToken(),

  // Check if we have a valid access token in memory
  hasAccessToken: () => !!memoryTokenStorage.getAccessToken(),

  // Check if we can potentially authenticate (have refresh token)
  hasTokens: () => {
    // If we have an access token in memory, use it
    if (memoryTokenStorage.hasTokens() && !memoryTokenStorage.isExpired()) {
      return true;
    }

    // If we have a refresh token, we can potentially restore the session
    return !!cookieTokenStorage.getRefreshToken();
  },
};
