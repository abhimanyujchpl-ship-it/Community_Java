import { Link } from "react-router-dom";
import { StatCard } from "../../components/cards/StatCard";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { LoadingState } from "../../components/ui/LoadingState";
import { routes } from "../../constants/routes";
import { usePrimaryCommunity } from "./hooks";
import "./member.css";

function metric(value: unknown) {
  if (Array.isArray(value)) return value.length;
  if (typeof value === "number") return value;
  return 0;
}

export function MemberDashboardPage() {
  const { community, approved, dashboard, loading, error, reload } = usePrimaryCommunity();
  if (loading) return <LoadingState label="Loading dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!community || !approved) {
    return (
      <section>
        <EmptyState title="Community access pending" message="Request access to a community and wait for admin approval to unlock your private dashboard." />
        <Link to={routes.communitySearch}><Card style={{ marginTop: 18 }}>Browse communities</Card></Link>
      </section>
    );
  }

  return (
    <section>
      <div className="page-head">
        <div><h1>Member Dashboard</h1><p className="muted">Welcome back. Your community workspace is ready.</p></div>
      </div>
      <div className="grid grid-3">
        <StatCard label="Community" value={community?.name || "Pending"} hint="Approved membership" />
        <StatCard label="Upcoming events" value={metric(dashboard?.upcomingEventsCount ?? dashboard?.upcomingEvents)} hint="Calendar reminders" />
        <StatCard label="Notifications" value={metric(dashboard?.notificationsCount ?? dashboard?.notifications)} hint="Unread and recent" />
      </div>
      <div className="grid grid-2" style={{ marginTop: 18 }}>
        <Card><h3>Community summary</h3><p className="muted">{community?.description || "Request access to unlock your private dashboard."}</p></Card>
        <Card><h3>Shortcuts</h3><div className="actions"><Link to={routes.feed}>Feed</Link><Link to={routes.events}>Events</Link><Link to={routes.calendar}>Calendar</Link><Link to={routes.myPosts}>My Posts</Link><Link to={routes.profile}>Profile</Link><Link to={routes.notifications}>Notifications</Link><Link to={routes.communitySearch}>Directory</Link></div></Card>
        <Card><h3>Feed preview</h3><p className="muted">{Array.isArray(dashboard?.feedPreview) && dashboard.feedPreview.length ? `${dashboard.feedPreview.length} approved posts ready` : "Approved posts will appear here."}</p></Card>
        <Card><h3>Announcements</h3><p className="muted">{Array.isArray(dashboard?.announcements) && dashboard.announcements.length ? `${dashboard.announcements.length} active announcements` : "No announcements yet."}</p></Card>
      </div>
    </section>
  );
}
