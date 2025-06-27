import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Navigate, Outlet } from "react-router";

export const AuthLayout = () => {
  const { token } = useSelector((state: RootState) => state.auth);

  if (token) return <Navigate to={"/dashboard"} />;

  return (
    <main className="w-full min-h-screen flex items-start p-4 sm:p-8 justify-center bg-linear-to-b from-white/10 to-black">
      <section className="max-w-md sm:max-w-lg lg:max-w-3xl mx-auto overflow-y-auto rounded-lg bg-dark w-full py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </section>
    </main>
  );
};
