import { SidebarHeader as SidebarHeaderUI } from "@/components/ui/sidebar";
import { CreatePlaylistDialog } from "../CreatePlaylistDialog";

interface SidebarHeaderProps {
  onPlaylistCreate: (data: { name: string; description?: string }) => void;
}

export const SidebarHeader = ({ onPlaylistCreate }: SidebarHeaderProps) => {
  return (
    <SidebarHeaderUI>
      <h1 className="text-xl sm:text-2xl font-bold tracking-wide text-center mb-2 mt-2">
        Listify
      </h1>
      <CreatePlaylistDialog onPlaylistCreate={onPlaylistCreate} />
    </SidebarHeaderUI>
  );
};
