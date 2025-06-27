import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router";
import { AuthLayout } from "@/components/layouts";
import { PrivateRoutes } from "@/components";
import { Login, Register } from "@/pages/auth";
import { Dashboard, PlaylistDetail } from "@/pages";
import { SidebarProvider } from "@/components/ui/sidebar";
import "./App.css";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { Toaster } from "./components/ui/sonner";
import { PersistGate } from "redux-persist/integration/react";
import { SpotifyCallback } from "./pages/callback";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ErrorBoundary>
          <SidebarProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/auth" element={<AuthLayout />}>
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                </Route>

                {/* Private Routes */}
                <Route element={<PrivateRoutes />}>
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route
                    path="/dashboard/playlist/:id"
                    element={<PlaylistDetail />}
                  />
                  <Route path="/callback" element={<SpotifyCallback />} />
                </Route>

                {/* Route Not Found */}
                <Route
                  path="*"
                  element={
                    <>
                      404 Page Not Found
                      <Link to={"/"}>Go to Dashboard</Link>
                    </>
                  }
                />
              </Routes>
              <Toaster richColors position="top-right" closeButton />
            </BrowserRouter>
          </SidebarProvider>
        </ErrorBoundary>
      </PersistGate>
    </Provider>
  );
}

export default App;
