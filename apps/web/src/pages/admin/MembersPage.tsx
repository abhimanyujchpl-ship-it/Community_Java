import { useEffect, useState } from "react";
import { StatCard } from "../../components/cards/StatCard";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { LoadingState } from "../../components/ui/LoadingState";
import { getApiError, pageItems } from "../../services/api";
import { communityService } from "../../services/community.service";
import { dashboardService, DashboardData } from "../../services/dashboard.service";

export function MembersPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const community = pageItems(await communityService.list())[0];
      setData(community ? await dashboardService.admin(community.id) : null);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const pendingRequests = Array.isArray(data?.pendingRequests) ? data.pendingRequests as Array<{ id: string; user?: { fullName?: string; email?: string; mobile?: string } }> : [];

  return (
    <section>
      <div className="page-head"><h1>Members</h1></div>
      <div className="grid grid-3">
        <StatCard label="Total members" value={String(data?.totalMembers ?? 0)} />
        <StatCard label="Blocked users" value={String(data?.blockedUsers ?? 0)} />
        <StatCard label="Pending access" value={String(data?.pendingAccessRequests ?? pendingRequests.length)} />
      </div>
      <Card style={{ marginTop: 18 }}>
        <h3>Pending member requests</h3>
        <div className="stack">
          {pendingRequests.length ? pendingRequests.map((request) => (
            <div key={request.id} className="notification-row">
              <div>
                <strong>{request.user?.fullName || "Pending member"}</strong>
                <p>{request.user?.email || request.user?.mobile || "Contact available after request review"}</p>
              </div>
            </div>
          )) : <EmptyState title="No pending members" message="New requests will appear here." />}
        </div>
      </Card>
    </section>
  );
}
