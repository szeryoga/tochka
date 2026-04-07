import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";

export function AdminLayout() {
  return (
    <div className="admin-shell">
      <Sidebar />
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
