import { NavLink } from "react-router-dom";
import { routes } from "../../constants/routes";
import { AuthUser, logout } from "../../store/auth.store";
import { Brand } from "./PublicLayout";
import "./layout.css";

const memberLinks = [
  ["Dashboard", routes.memberDashboard],
  ["Browse", routes.communitySearch],
  ["Feed", routes.feed],
  ["Create Post", routes.createPost],
  ["My Posts", routes.myPosts],
  ["Events", routes.events],
  ["Calendar", routes.calendar],
  ["Notifications", routes.notifications],
  ["Profile", routes.profile]
];

const adminLinks = [
  ["Dashboard", routes.adminDashboard],
  ["Access Requests", routes.accessRequests],
  ["Post Approvals", routes.postApprovals],
  ["Members", routes.adminMembers],
  ["Events", routes.adminEvents],
  ["Settings", routes.adminSettings]
];

export function Sidebar({ user }: { user: AuthUser | null }) {
  const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "COMMUNITY_ADMIN";
  const links = isAdmin ? adminLinks : memberLinks;
  return (
    <aside className="sidebar">
      <Brand />
      <nav>
        {links.map(([label, to]) => (
          <NavLink key={to} to={to} className={({ isActive }) => (isActive ? "active" : "")}>
            {label}
          </NavLink>
        ))}
        <button
          type="button"
          className="sidebar-logout"
          onClick={() => {
            logout();
            window.location.assign(routes.login);
          }}
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}
