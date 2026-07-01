import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { StatCard } from "../../components/cards/StatCard";
import { Card } from "../../components/ui/Card";
import { ErrorState } from "../../components/ui/ErrorState";
import { LoadingState } from "../../components/ui/LoadingState";
import { routes } from "../../constants/routes";
import { pageItems, getApiError } from "../../services/api";
import { communityService } from "../../services/community.service";
import { dashboardService } from "../../services/dashboard.service";

export function AdminDashboardPage() {
  const [data, setData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function load() {
    setLoading(true);
    try {
      const communities = pageItems(await communityService.list());
      if (communities[0]) setData(await dashboardService.admin(communities[0].id));
    } catch (err) { setError(getApiError(err)); } finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  return <section><div className="page-head"><h1>Admin Dashboard</h1></div><div className="grid grid-3"><StatCard label="Total members" value={String(data.totalMembers ?? data.memberCount ?? 0)} /><StatCard label="Pending access" value={String(data.pendingAccessRequests ?? 0)} /><StatCard label="Pending posts" value={String(data.pendingPostApprovals ?? 0)} /><StatCard label="Upcoming events" value={String(data.upcomingEvents ?? 0)} /><StatCard label="Notifications" value={String(data.notificationsCount ?? 0)} /><StatCard label="Blocked users" value={String(data.blockedUsers ?? 0)} /></div><Card style={{ marginTop: 18 }}><h3>Quick actions</h3><div className="actions"><Link to={routes.accessRequests}>Access Requests</Link><Link to={routes.postApprovals}>Post Approvals</Link><Link to={routes.adminEvents}>Create Event</Link><Link to={routes.adminMembers}>Members</Link><Link to={routes.adminSettings}>Settings</Link></div></Card></section>;
}
