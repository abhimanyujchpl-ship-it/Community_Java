import { Outlet } from "react-router-dom";
import { AuthUser } from "../../store/auth.store";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import "./layout.css";

export function DashboardLayout({ user }: { user: AuthUser | null }) {
  return (
    <div className="dashboard-layout">
      <Sidebar user={user} />
      <main className="dashboard-main">
        <Topbar user={user} />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
