import type { Playlist } from "@/types/user.types";
import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQueryWithReauth } from ".";

interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export const playlistApi = createApi({
  reducerPath: "playlistApi",
  baseQuery: fetchBaseQueryWithReauth,
  tagTypes: ["Playlist"],
  endpoints: (builder) => ({
    createPlaylist: builder.mutation<
      ApiResponse<Playlist>,
      { name: string; description?: string; songs: string[]; userId: string }
    >({
      query: (playlist) => ({
        url: "/playlists",
        method: "POST",
        body: playlist,
      }),
      invalidatesTags: ["Playlist"],
    }),
    deletePlaylist: builder.mutation<
      ApiResponse<Playlist>,
      { playlistId: string }
    >({
      query: ({ playlistId }) => ({
        url: `/playlists/${playlistId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Playlist"],
    }),
    updatePlaylist: builder.mutation<
      ApiResponse<Playlist>,
      { playlistId: string; name: string; description?: string }
    >({
      query: ({ playlistId, name, description }) => ({
        url: `/playlists/${playlistId}`,
        method: "PUT",
        body: { name, description },
      }),
      invalidatesTags: ["Playlist"],
    }),
    getUsersPlaylists: builder.query<ApiResponse<Playlist[]>, void>({
      query: () => ({
        url: `/playlists`,
      }),
      providesTags: ["Playlist"],
    }),
    getPlaylistById: builder.query<
      ApiResponse<Playlist>,
      { playlistId: string }
    >({
      query: ({ playlistId }) => ({
        url: `/playlists/${playlistId}`,
      }),
      providesTags: ["Playlist"],
    }),
    addSongToPlaylist: builder.mutation<
      ApiResponse<Playlist>,
      {
        playlistId: string;
        song: {
          title: string;
          artists: string[];
          album: string;
          duration: number;
          cover: string;
          spotifyId: string;
          spotifyUrl: string;
        };
      }
    >({
      query: ({ playlistId, song }) => ({
        url: `/playlists/${playlistId}/songs`,
        method: "POST",
        body: song,
      }),
      invalidatesTags: ["Playlist"],
    }),
    deleteSongFromPlaylist: builder.mutation<
      ApiResponse<Playlist>,
      { playlistId: string; songId: string }
    >({
      query: ({ playlistId, songId }) => ({
        url: `/playlists/${playlistId}/songs/${songId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Playlist"],
    }),
  }),
});

export const {
  useCreatePlaylistMutation,
  useDeletePlaylistMutation,
  useUpdatePlaylistMutation,
  useGetUsersPlaylistsQuery,
  useGetPlaylistByIdQuery,
  useAddSongToPlaylistMutation,
  useDeleteSongFromPlaylistMutation,
} = playlistApi;
