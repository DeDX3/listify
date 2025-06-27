import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

export const MobileHeader = () => {
  return (
    <div className="flex items-center justify-between p-4 border-b md:hidden">
      <div className="flex items-center gap-3">
        <SidebarTrigger>
          <Menu className="h-5 w-5" />
        </SidebarTrigger>
        <h1 className="text-xl font-bold">Listify</h1>
      </div>
    </div>
  );
};
