import { useExchangeCodeForTokenMutation } from "@/store/api/spotify";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { errorHandler } from "@/utils/errorHandler";

export const SpotifyCallback = () => {
  const navigate = useNavigate();
  const [exchangeCodeForToken] = useExchangeCodeForTokenMutation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = new URLSearchParams(window.location.search).get("code");
        const error = new URLSearchParams(window.location.search).get("error");

        if (error) {
          errorHandler.logError(
            `Spotify authorization error: ${error}`,
            "SpotifyAuth"
          );
          navigate("/dashboard");
          return;
        }

        if (code) {
          await exchangeCodeForToken(code).unwrap();
          navigate("/dashboard");
        } else {
          errorHandler.logError("No authorization code found", "SpotifyAuth");
          navigate("/dashboard");
        }
      } catch (error) {
        errorHandler.logError(error as Error, "SpotifyCallback");
        navigate("/dashboard");
      }
    };

    handleCallback();
  }, [exchangeCodeForToken, navigate]);

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold">Taking you back to Listify...</h2>
      </div>
    </div>
  );
};
