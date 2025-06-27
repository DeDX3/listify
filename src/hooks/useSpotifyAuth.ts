import { useState, useEffect } from "react";
import { cookieHybridStorage } from "@/utils/cookieTokenStorage";
import { SPOTIFY_CONFIG } from "@/config/spotify-config";
import { errorHandler } from "@/utils/errorHandler";

export const useSpotifyAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Refresh access token using refresh token when current token expires
  const refreshToken = async () => {
    const refreshTokenValue = cookieHybridStorage.getRefreshToken();

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
      cookieHybridStorage.setTokens(
        data.access_token,
        data.refresh_token || refreshTokenValue,
        data.expires_in
      );
      return true;
    } else {
      throw new Error("Failed to refresh token");
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we have a valid access token in memory
        if (
          cookieHybridStorage.hasAccessToken() &&
          !cookieHybridStorage.isExpired()
        ) {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        // If no valid access token but we have refresh token, try to refresh
        if (cookieHybridStorage.hasRefreshToken()) {
          await refreshToken();
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        errorHandler.logError(error as Error, "AuthRestore");
        setIsAuthenticated(false);
        cookieHybridStorage.clear();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Check authentication status every minute to handle token expiration
    const interval = setInterval(checkAuth, 60000);

    return () => clearInterval(interval);
  }, []);

  const logout = () => {
    cookieHybridStorage.clear();
    setIsAuthenticated(false);
  };

  const getAccessToken = () => cookieHybridStorage.getAccessToken();
  const getRefreshToken = () => cookieHybridStorage.getRefreshToken();
  const isExpired = () => cookieHybridStorage.isExpired();

  return {
    isAuthenticated,
    isLoading,
    logout,
    getAccessToken,
    getRefreshToken,
    isExpired,
  };
};
