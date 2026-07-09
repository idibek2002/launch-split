import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { useLunchSession } from "@/hooks/useLunchSession";

export const Layout = () => {
  const { clearAll } = useLunchSession();
  const location = useLocation();

  // Страница просмотра расшаренного расчёта — для других людей
  const isSharedView = location.pathname.startsWith("/share");

  return (
    <div className="min-h-screen bg-background">
      <Header onClearAll={clearAll} isSharedView={isSharedView} />

      <main className="container mx-auto px-4 py-6 max-w-2xl space-y-5">
        <Outlet />
      </main>
    </div>
  );
};
