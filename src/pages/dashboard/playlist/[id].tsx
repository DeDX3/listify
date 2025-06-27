import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  useAddSongToPlaylistMutation,
  useGetPlaylistByIdQuery,
  useDeleteSongFromPlaylistMutation,
} from "@/store/api/playlist";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import { toast } from "sonner";
import { SongSearch } from "@/components/SongSearch";
import { SongsTable } from "@/components/SongsTable";
import { DashboardLayout } from "@/components/DashboardLayout";
import { setActivePlaylist } from "@/store/slices/playlistSlice";
import type { Song } from "@/types/user.types";
import { errorHandler } from "@/utils/errorHandler";

interface Track {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  duration_ms: number;
  external_urls: {
    spotify: string;
  };
}

// Convert Spotify track data to our backend song format
const formatSongForBackend = (track: Track) => {
  return {
    title: track.name,
    artists: track.artists.map((artist) => artist.name),
    album: track.album.name,
    duration: Math.round(track.duration_ms / 1000),
    cover: track.album.images[0]?.url || "",
    spotifyId: track.id,
    spotifyUrl: track.external_urls.spotify,
  };
};

export const PlaylistDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [deletingSongId, setDeletingSongId] = useState<string | null>(null);
  const activePlaylist = useSelector(
    (state: RootState) => state.playlist.activePlaylist
  );
  const [addSongToPlaylist] = useAddSongToPlaylistMutation();
  const [deleteSongFromPlaylist, { isLoading: isDeletingSong }] =
    useDeleteSongFromPlaylistMutation();

  const { data: playlistData, isLoading: playlistLoading } =
    useGetPlaylistByIdQuery({ playlistId: id! }, { skip: !id });

  useEffect(() => {
    if (
      id &&
      playlistData?.data &&
      (!activePlaylist || activePlaylist._id !== id)
    ) {
      dispatch(setActivePlaylist(playlistData.data));
    }
  }, [id, playlistData, activePlaylist, dispatch]);

  useEffect(() => {
    if (!activePlaylist && !playlistLoading) {
      navigate("/dashboard");
    }
  }, [activePlaylist, playlistLoading, navigate]);

  const handleAddSong = async (track: Track) => {
    if (!id) return;

    try {
      const formattedSong = formatSongForBackend(track);
      await addSongToPlaylist({
        playlistId: id,
        song: formattedSong,
      }).unwrap();

      toast.success("Song added successfully");
    } catch (error) {
      errorHandler.logError(error as Error, "AddSongToPlaylist");
      toast.error(
        (error as any).data?.message || "Failed to add song to playlist"
      );
    }
  };

  const handleDeleteSong = async (songId: string) => {
    if (!id) return;

    setDeletingSongId(songId);
    try {
      await deleteSongFromPlaylist({
        playlistId: id,
        songId: songId,
      }).unwrap();

      toast.success("Song removed from playlist");
    } catch (error) {
      errorHandler.logError(error as Error, "DeleteSongFromPlaylist");
      toast.error(
        (error as any).data?.message || "Failed to remove song from playlist"
      );
    }
    setDeletingSongId(null);
  };

  const songs = playlistData?.data?.songs || [];

  if (playlistLoading || !activePlaylist) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64 px-4">
          <div className="text-center">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Loading...
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              {!activePlaylist
                ? "Redirecting to dashboard..."
                : "Loading playlist..."}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-4 sm:mb-6">
          <SongSearch
            onAddSong={handleAddSong}
            className="w-full max-w-md mx-auto block"
          />
        </div>

        <div className="mt-6 sm:mt-8">
          <SongsTable
            songs={songs as unknown as Song[]}
            isLoading={playlistLoading}
            onDeleteSong={handleDeleteSong}
            deletingSongId={deletingSongId}
            isDeletingSong={isDeletingSong}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};
