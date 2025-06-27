import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import type { Playlist } from "@/types/user.types";

interface PlaylistListProps {
  playlists: Playlist[];
  isLoading: boolean;
  error: any;
  activePlaylist: Playlist | null;
  onPlaylistClick: (playlist: Playlist) => void;
  onEditPlaylist: (playlistId: string) => void;
  onDeletePlaylist: (playlistId: string) => void;
}

export const PlaylistList = ({
  playlists,
  isLoading,
  error,
  activePlaylist,
  onPlaylistClick,
  onEditPlaylist,
  onDeletePlaylist,
}: PlaylistListProps) => {
  if (isLoading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-2">
        <LoadingSpinner size="lg" text="Fetching your playlists" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-2">
        <h1 className="text-2xl font-bold">Error</h1>
        <p className="text-sm text-muted-foreground">
          Failed to load playlists
        </p>
      </div>
    );
  }

  if (playlists.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-2">
        <h1 className="text-2xl font-bold">No Playlists</h1>
        <p className="text-sm text-muted-foreground">
          Create a playlist to get started
        </p>
      </div>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Playlists</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {playlists.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                onClick={() => onPlaylistClick(item)}
                title={item.name}
                variant={activePlaylist?._id === item._id ? "theme" : "default"}
                isActive={activePlaylist?._id === item._id}
              >
                <span className="truncate block">{item.name}</span>
              </SidebarMenuButton>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction>
                    <MoreHorizontal />
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start">
                  <DropdownMenuItem onClick={() => onEditPlaylist(item._id)}>
                    <span>Edit Playlist</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDeletePlaylist(item._id)}>
                    <span>Delete Playlist</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
