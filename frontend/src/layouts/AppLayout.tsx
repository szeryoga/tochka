import { Outlet } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { BottomNav } from "../components/BottomNav";

export function AppLayout() {
  return (
    <div className="app-shell">
      <AppHeader />
      <main className="app-content">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
