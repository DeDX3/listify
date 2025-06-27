export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  playlists: string[];
}

export interface Playlist {
  _id: string;
  name: string;
  description: string;
  songs: string[];
  userId: string;
}

export interface Song {
  _id: string;
  title: string;
  artists: string[];
  album: string;
  cover?: string;
  duration: number;
  spotifyId: string;
}
