import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "../../constants/routes";
import { notificationService } from "../../services/notification.service";
import { AuthUser, clearAuth } from "../../store/auth.store";
import { Button } from "../ui/Button";
import "./layout.css";

export function Topbar({ user }: { user: AuthUser | null }) {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!user) return;
    const load = () => notificationService.unreadCount().then((value) => setCount(typeof value === "number" ? value : value.count || 0)).catch(() => setCount(0));
    void load();
    window.addEventListener("notifications-changed", load);
    return () => window.removeEventListener("notifications-changed", load);
  }, [user]);

  function logout() {
    clearAuth();
    navigate(routes.login);
  }

  function search(event: FormEvent) {
    event.preventDefault();
    const suffix = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : "";
    navigate(`${routes.communitySearch}${suffix}`);
  }

  return (
    <header className="topbar">
      <form className="topbar-search" onSubmit={search}>
        <input aria-label="Search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search community..." />
      </form>
      <div className="topbar-actions">
        <Link className="notification-pill" to={routes.notifications}>{count} unread</Link>
        <Link className="avatar" to={routes.profile}>{user?.fullName?.slice(0, 1) || "U"}</Link>
        <Button type="button" variant="ghost" onClick={logout}>Logout</Button>
      </div>
    </header>
  );
}
