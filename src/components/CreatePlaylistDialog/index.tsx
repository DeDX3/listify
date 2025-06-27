import { useState } from "react";
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
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const createPlaylistSchema = z.object({
  name: z.string().min(1, "Playlist name is required"),
  description: z.string().optional(),
});

type CreatePlaylistForm = z.infer<typeof createPlaylistSchema>;

interface CreatePlaylistDialogProps {
  onPlaylistCreate?: (data: CreatePlaylistForm) => void;
}

export const CreatePlaylistDialog = ({
  onPlaylistCreate,
}: CreatePlaylistDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<CreatePlaylistForm>({
    resolver: zodResolver(createPlaylistSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (data: CreatePlaylistForm) => {
    onPlaylistCreate?.(data);
    setIsDialogOpen(false);
    form.reset();
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    form.reset();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus /> Create Playlist
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Create New Playlist
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Enter the details for your new playlist.
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

            <DialogFooter className="flex-col sm:flex-row gap-2">
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
                variant="theme"
                className="w-full sm:w-auto"
              >
                Create Playlist
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
