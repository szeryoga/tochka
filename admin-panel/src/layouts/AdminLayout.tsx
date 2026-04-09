import { Outlet } from "react-router-dom";
import { AdminErrorBoundary } from "../components/AdminErrorBoundary";
import { Sidebar } from "../components/Sidebar";

export function AdminLayout() {
  return (
    <div className="admin-shell">
      <Sidebar />
      <main className="admin-content">
        <AdminErrorBoundary>
          <Outlet />
        </AdminErrorBoundary>
      </main>
    </div>
  );
}
