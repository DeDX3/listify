import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { SpotifyLoginButton } from "@/components/SpotifyLoginButton";
import { useSpotifyAuth } from "@/hooks/useSpotifyAuth";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { DashboardLayout } from "@/components/DashboardLayout";

export const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { isAuthenticated, isLoading: authLoading } = useSpotifyAuth();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show Spotify login if user is logged in but not connected to Spotify
  if (user && !isAuthenticated) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4 px-4">
          <h2 className="text-lg sm:text-xl font-semibold text-center">
            Welcome to Listify
          </h2>
          <ul className="text-muted-foreground text-sm sm:text-base space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-theme font-medium">1.</span>
              <span>
                Click to <SpotifyLoginButton /> (If done before, you can skip
                this step)
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-theme font-medium">2.</span>
              <span>Create a playlist</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-theme font-medium">3.</span>
              <span>Click on the playlist to set it as active</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-theme font-medium">4.</span>
              <span>Add songs to the playlist using the search bar</span>
            </li>
          </ul>
        </div>
      </DashboardLayout>
    );
  }

  // Show login message if user is not authenticated at all
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen px-4">
        <div className="text-center">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Please log in to continue
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            You need to be logged in to access Listify
          </p>
        </div>
      </div>
    );
  }

  // Show main dashboard for authenticated users
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center h-64 gap-4 px-4">
        <h2 className="text-lg sm:text-xl font-semibold text-center">
          Welcome to Listify {user?.name}
        </h2>
      </div>
    </DashboardLayout>
  );
};
