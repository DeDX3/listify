import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import playlistReducer from "./slices/playlistSlice";
import spotifyReducer from "./slices/spotifySlice";
import { authApi } from "./api/auth";
import { playlistApi } from "./api/playlist";
import { spotifyApi } from "./api/spotify";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  auth: authReducer,
  playlist: playlistReducer,
  spotify: spotifyReducer,
  [authApi.reducerPath]: authApi.reducer,
  [playlistApi.reducerPath]: playlistApi.reducer,
  [spotifyApi.reducerPath]: spotifyApi.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "playlist", "spotify"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      authApi.middleware,
      playlistApi.middleware,
      spotifyApi.middleware
    ),
  devTools: true,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
