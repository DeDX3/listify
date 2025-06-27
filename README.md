# Listify

A music playlist management app that lets you create and manage playlists using Spotify's music library.

## What it does

Listify connects to your Spotify account and lets you:

- Create custom playlists
- Search for songs from Spotify's vast library
- Add songs to your playlists
- Remove songs from playlists
- View all your playlists in one place

## How it works

1. **Sign up/Login** - Create an account or log in to Listify
2. **Connect Spotify** - Link your Spotify account to access music
3. **Create Playlists** - Make new playlists to select existing ones
4. **Search & Add Songs** - Find songs on Spotify and add them to your playlists
5. **Manage Your Music** - View, edit, and delete your playlists

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- A Spotify account
- Spotify Developer credentials

### Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the backend server
4. Run the development server: `npm run dev`

### Environment Variables

Create a `.env` file with:

```
VITE_SPOTIFY_CLIENT_ID=client-id
VITE_LISTIFY_API_URL=backend-url-with-port
VITE_SPOTIFY_API_URL=https://api.spotify.com/v1
VITE_SPOTIFY_AUTH_URL=https://accounts.spotify.com/authorize
VITE_SPOTIFY_TOKEN_URL=https://accounts.spotify.com/api/token
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
VITE_ENCRYPTION_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

## Tech Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Redux Toolkit
- **Authentication**: Custom auth with Spotify OAuth
- **Build Tool**: Vite

## Features

- **Secure Authentication**: OAuth flow with Spotify
- **Responsive Design**: Works on desktop and mobile
- **Real-time Search**: Search Spotify's music library
- **Playlist Management**: Create, edit, and delete playlists
- **Token Security**: Encrypted token storage for security

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── store/         # Redux store and rtk-query API
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
└── types/         # TypeScript type definitions
```
