import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Playlist } from "@/types/user.types";

const editPlaylistSchema = z.object({
  name: z.string().min(1, "Playlist name is required"),
  description: z.string().optional(),
});

type EditPlaylistForm = z.infer<typeof editPlaylistSchema>;

interface EditPlaylistDialogProps {
  playlist?: Playlist | null;
  onPlaylistUpdate?: (data: EditPlaylistForm) => void;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const EditPlaylistDialog = ({
  playlist,
  onPlaylistUpdate,
  trigger,
  open,
  onOpenChange,
}: EditPlaylistDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isControlled = open !== undefined;

  const form = useForm<EditPlaylistForm>({
    resolver: zodResolver(editPlaylistSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Update form when playlist changes
  useEffect(() => {
    if (playlist) {
      form.reset({
        name: playlist.name,
        description: playlist.description || "",
      });
    }
  }, [playlist, form]);

  // Auto-open when playlist is provided
  useEffect(() => {
    if (playlist && !isControlled) {
      setIsDialogOpen(true);
    }
  }, [playlist, isControlled]);

  const handleOpenChange = (newOpen: boolean) => {
    if (isControlled) {
      onOpenChange?.(newOpen);
    } else {
      setIsDialogOpen(newOpen);
    }
  };

  const currentOpen = isControlled ? open : isDialogOpen;

  const onSubmit = (data: EditPlaylistForm) => {
    onPlaylistUpdate?.(data);
    handleOpenChange(false);
  };

  const handleCancel = () => {
    if (playlist) {
      form.reset({
        name: playlist.name,
        description: playlist.description || "",
      });
    }
    handleOpenChange(false);
  };

  if (!playlist) return null;

  return (
    <Dialog open={currentOpen} onOpenChange={handleOpenChange}>
      {!isControlled && trigger && (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Edit Playlist
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Update the details for your playlist.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter playlist name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter playlist description (optional)"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs sm:text-sm">
                    Optional description for your playlist
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                className="w-full sm:w-auto"
              >
                Update Playlist
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
