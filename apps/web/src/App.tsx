import { useEffect, useState } from "react";
import { BrowserRouter, Link, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { PublicLayout } from "./components/layout/PublicLayout";
import { Card } from "./components/ui/Card";
import { routes } from "./constants/routes";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { AccessRequestsPage } from "./pages/admin/AccessRequestsPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminEventsPage } from "./pages/admin/AdminEventsPage";
import { MembersPage } from "./pages/admin/MembersPage";
import { PostApprovalsPage } from "./pages/admin/PostApprovalsPage";
import { SettingsPage } from "./pages/admin/SettingsPage";
import { NotFoundPage } from "./pages/common/NotFoundPage";
import { CalendarPage } from "./pages/member/CalendarPage";
import { CommunityDashboardPage } from "./pages/member/CommunityDashboardPage";
import { CommunitySearchPage } from "./pages/member/CommunitySearchPage";
import { CreatePostPage } from "./pages/member/CreatePostPage";
import { EventsPage } from "./pages/member/EventsPage";
import { FeedPage } from "./pages/member/FeedPage";
import { MemberDashboardPage } from "./pages/member/MemberDashboardPage";
import { MyPostsPage } from "./pages/member/MyPostsPage";
import { NotificationsPage } from "./pages/member/NotificationsPage";
import { ProfilePage } from "./pages/member/ProfilePage";
import { LandingPage } from "./pages/public/LandingPage";
import { AuthUser, getAuthState, Role } from "./store/auth.store";

function useAuthSnapshot() {
  const [state, setState] = useState(getAuthState());
  useEffect(() => {
    const sync = () => setState(getAuthState());
    window.addEventListener("auth-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("auth-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return state;
}

function ProtectedRoute({ user, roles }: { user: AuthUser | null; roles?: Role[] }) {
  const token = getAuthState().token;
  if (!token || !user) return <Navigate to={routes.login} replace />;
  if (roles && !roles.includes(user.role)) {
    return (
      <main className="auth-page">
        <Card>
          <h1>Access denied</h1>
          <p className="muted">Your account role cannot open this page.</p>
          <Link to={user.role === "MEMBER" ? routes.memberDashboard : routes.adminDashboard}>
            Go to dashboard
          </Link>
        </Card>
      </main>
    );
  }
  return <Outlet />;
}

function DashboardShell() {
  const { user } = useAuthSnapshot();
  return <DashboardLayout user={user} />;
}

export default function App() {
  const { user } = useAuthSnapshot();
  const adminRoles: Role[] = ["SUPER_ADMIN", "COMMUNITY_ADMIN"];
  const memberRoles: Role[] = ["MEMBER", "COMMUNITY_ADMIN", "SUPER_ADMIN"];

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path={routes.home} element={<LandingPage />} />
        </Route>
        <Route path={routes.login} element={<LoginPage />} />
        <Route path={routes.register} element={<RegisterPage />} />

        <Route element={<ProtectedRoute user={user} roles={memberRoles} />}>
          <Route element={<DashboardShell />}>
            <Route path={routes.memberDashboard} element={<MemberDashboardPage />} />
            <Route path={routes.communitySearch} element={<CommunitySearchPage />} />
            <Route path={routes.communityDashboard} element={<CommunityDashboardPage />} />
            <Route path={routes.feed} element={<FeedPage />} />
            <Route path={routes.createPost} element={<CreatePostPage />} />
            <Route path={routes.myPosts} element={<MyPostsPage />} />
            <Route path={routes.events} element={<EventsPage />} />
            <Route path={routes.calendar} element={<CalendarPage />} />
            <Route path={routes.notifications} element={<NotificationsPage />} />
            <Route path={routes.profile} element={<ProfilePage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute user={user} roles={adminRoles} />}>
          <Route element={<DashboardShell />}>
            <Route path={routes.adminDashboard} element={<AdminDashboardPage />} />
            <Route path={routes.accessRequests} element={<AccessRequestsPage />} />
            <Route path={routes.postApprovals} element={<PostApprovalsPage />} />
            <Route path={routes.adminMembers} element={<MembersPage />} />
            <Route path={routes.adminEvents} element={<AdminEventsPage />} />
            <Route path={routes.adminSettings} element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
