import { useState, useEffect, useRef } from "react";
import { useSearchTracksQuery } from "@/store/api/spotify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/LoadingSpinner";

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

interface SongSearchProps {
  onAddSong: (track: Track) => void;
  className?: string;
}

export const SongSearch = ({ onAddSong, className }: SongSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: searchResults, isLoading } = useSearchTracksQuery(
    debouncedQuery,
    {
      skip: !debouncedQuery || debouncedQuery.length < 2,
    }
  );

  const tracks = searchResults?.tracks?.items || [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsOpen(e.target.value.length >= 2);
  };

  const handleAddSong = (track: Track) => {
    onAddSong(track);
    setSearchQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className={cn("relative", className)}>
      <Input
        type="text"
        placeholder="Search for a song on Spotify..."
        value={searchQuery}
        onChange={handleInputChange}
        onFocus={() => searchQuery.length >= 2 && setIsOpen(true)}
        className="w-full"
      />

      {/* Floating Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-60 sm:max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center">
              <LoadingSpinner text="Searching..." />
            </div>
          ) : tracks.length > 0 ? (
            <div className="py-1">
              {tracks.map((track: Track) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between p-2 sm:p-3 hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => handleAddSong(track)}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                    <img
                      src={
                        track.album.images[0]?.url || "/placeholder-album.png"
                      }
                      alt={track.album.name}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-sm sm:text-base">
                        {track.name}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        {track.artists.map((artist) => artist.name).join(", ")}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-2 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddSong(track);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : debouncedQuery.length >= 2 ? (
            <div className="p-4 text-center">
              <p className="text-muted-foreground text-sm sm:text-base">
                No songs found
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
