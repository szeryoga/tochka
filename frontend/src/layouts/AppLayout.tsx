import { Outlet, useLocation } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { BottomNav } from "../components/BottomNav";

export function AppLayout() {
  const location = useLocation();
  const isDetailPage =
    /^\/events\/\d+$/.test(location.pathname) || /^\/courses\/\d+$/.test(location.pathname);

  return (
    <div className="app-shell">
      {!isDetailPage ? <AppHeader /> : null}
      <main className={`app-content${isDetailPage ? " app-content--detail" : ""}`}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
