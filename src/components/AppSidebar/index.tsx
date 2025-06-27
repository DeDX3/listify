import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { persistor, type AppDispatch, type RootState } from "@/store";
import { logout } from "@/store/slices/authSlice";
import {
  setActivePlaylist,
  clearActivePlaylist,
} from "@/store/slices/playlistSlice";
import { EditPlaylistDialog } from "../EditPlaylistDialog";
import {
  useCreatePlaylistMutation,
  useDeletePlaylistMutation,
  useUpdatePlaylistMutation,
  useGetUsersPlaylistsQuery,
} from "@/store/api/playlist";
import { toast } from "sonner";
import { playlistApi } from "@/store/api/playlist";
import { useState } from "react";
import { useSpotifyAuth } from "@/hooks/useSpotifyAuth";
import { SidebarHeader } from "../SidebarHeader";
import { PlaylistList } from "../PlaylistList";
import { UserProfile } from "../UserProfile";
import { errorHandler } from "@/utils/errorHandler";

export const AppSidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [createPlaylist] = useCreatePlaylistMutation();
  const [updatePlaylist] = useUpdatePlaylistMutation();
  const { user } = useSelector((state: RootState) => state.auth);
  const { activePlaylist } = useSelector((state: RootState) => state.playlist);
  const [deletePlaylist] = useDeletePlaylistMutation();
  const { data: playlistsData, isLoading, error } = useGetUsersPlaylistsQuery();
  const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { logout: logoutSpotify } = useSpotifyAuth();

  const handlePlaylistCreate = async (data: {
    name: string;
    description?: string;
  }) => {
    if (!user) return;

    try {
      await createPlaylist({
        name: data.name,
        description: data.description,
        songs: [],
        userId: user._id,
      }).unwrap();

      toast.success("Playlist created successfully");
    } catch (error) {
      errorHandler.logError(error as Error, "PlaylistCreate");
      toast.error((error as any).data?.message || "Failed to create playlist");
    }
  };

  const handlePlaylistUpdate = async (data: {
    name: string;
    description?: string;
  }) => {
    if (!editingPlaylistId) return;

    try {
      await updatePlaylist({
        playlistId: editingPlaylistId,
        name: data.name,
        description: data.description,
      }).unwrap();

      toast.success("Playlist updated successfully");
      setEditingPlaylistId(null);
      setIsEditDialogOpen(false);
    } catch (error) {
      errorHandler.logError(error as Error, "PlaylistUpdate");
      toast.error((error as any).data?.message || "Failed to update playlist");
    }
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    try {
      await deletePlaylist({ playlistId }).unwrap();
      toast.success("Playlist deleted successfully");

      if (activePlaylist?._id === playlistId) {
        dispatch(clearActivePlaylist());
      }
    } catch (error) {
      errorHandler.logError(error as Error, "PlaylistDelete");
      toast.error((error as any).data?.message || "Failed to delete playlist");
    }
  };

  const handleLogout = () => {
    logoutSpotify();
    dispatch(logout());
    dispatch(clearActivePlaylist());
    persistor.purge();
    dispatch(playlistApi.util.resetApiState());
  };

  const handlePlaylistClick = (playlist: any) => {
    dispatch(setActivePlaylist(playlist));
    navigate(`/dashboard/playlist/${playlist._id}`);
  };

  const handleEditPlaylist = (playlistId: string) => {
    setEditingPlaylistId(playlistId);
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setEditingPlaylistId(null);
  };

  const playlists = playlistsData?.data || [];

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader onPlaylistCreate={handlePlaylistCreate} />

        <SidebarContent>
          <PlaylistList
            playlists={playlists}
            isLoading={isLoading}
            error={error}
            activePlaylist={activePlaylist}
            onPlaylistClick={handlePlaylistClick}
            onEditPlaylist={handleEditPlaylist}
            onDeletePlaylist={handleDeletePlaylist}
          />
        </SidebarContent>

        <UserProfile user={user!} onLogout={handleLogout} />
      </Sidebar>

      <EditPlaylistDialog
        playlist={
          editingPlaylistId
            ? playlists.find((p) => p._id === editingPlaylistId) || null
            : null
        }
        onPlaylistUpdate={handlePlaylistUpdate}
        open={isEditDialogOpen}
        onOpenChange={handleEditDialogClose}
      />
    </>
  );
};
