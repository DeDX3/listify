import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Playlist } from "@/types/user.types";

const playlistSlice = createSlice({
  name: "playlist",
  initialState: {
    activePlaylist: null as Playlist | null,
  },
  reducers: {
    setActivePlaylist: (state, action: PayloadAction<Playlist>) => {
      state.activePlaylist = action.payload;
    },
    clearActivePlaylist: (state) => {
      state.activePlaylist = null;
    },
  },
});

export const { setActivePlaylist, clearActivePlaylist } = playlistSlice.actions;
export default playlistSlice.reducer;
