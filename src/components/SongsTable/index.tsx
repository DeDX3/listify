import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import type { Song } from "@/types/user.types";

interface SongsTableProps {
  songs: Song[];
  isLoading: boolean;
  onDeleteSong: (songId: string) => void;
  deletingSongId?: string | null;
  isDeletingSong?: boolean;
}

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const SongsTable = ({
  songs,
  isLoading,
  onDeleteSong,
  deletingSongId,
  isDeletingSong,
}: SongsTableProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <LoadingSpinner text="Loading songs..." />
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No songs in this playlist yet</p>
        <p className="text-sm text-muted-foreground mt-2">
          Search for songs above to add them to your playlist
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="hidden sm:table-cell">Artist</TableHead>
            <TableHead className="hidden md:table-cell">Album</TableHead>
            <TableHead className="hidden lg:table-cell w-20">
              Duration
            </TableHead>
            <TableHead className="w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {songs.map((song: Song, index: number) => (
            <TableRow key={song._id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <img
                    src={song.cover || "/placeholder-album.png"}
                    alt={song.album}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-sm sm:text-base truncate block">
                      {song.title}
                    </span>
                    <span className="text-xs sm:text-sm text-muted-foreground truncate block sm:hidden">
                      {Array.isArray(song.artists)
                        ? song.artists.join(", ")
                        : song.artists}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {Array.isArray(song.artists)
                  ? song.artists.join(", ")
                  : song.artists}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {song.album}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {formatDuration(song.duration)}
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDeleteSong(song._id)}
                  disabled={isDeletingSong && deletingSongId === song._id}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  {isDeletingSong && deletingSongId === song._id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
