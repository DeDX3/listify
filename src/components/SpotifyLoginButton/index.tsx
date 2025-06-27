import { generateCodeChallenge, getAuthUrl } from "@/utils";
import { Button } from "../ui/button";

export const SpotifyLoginButton = () => {
  const handleLogin = async () => {
    const { codeChallenge, codeVerifier } = await generateCodeChallenge();

    localStorage.setItem("spotify_code_verifier", codeVerifier);

    const authUrl = await getAuthUrl(codeChallenge);
    if (authUrl) {
      window.location.href = authUrl;
    }
  };

  return (
    <Button
      variant={"theme"}
      onClick={handleLogin}
      className="ml-1 cursor-pointer"
    >
      Login with Spotify
    </Button>
  );
};
