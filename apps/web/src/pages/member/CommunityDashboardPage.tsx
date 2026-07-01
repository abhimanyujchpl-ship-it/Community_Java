import { Card } from "../../components/ui/Card";
import { ErrorState } from "../../components/ui/ErrorState";
import { LoadingState } from "../../components/ui/LoadingState";
import { usePrimaryCommunity } from "./hooks";

export function CommunityDashboardPage() {
  const { community, approved, loading, error, reload } = usePrimaryCommunity();
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!approved) return <Card><h1>Access pending</h1><p className="muted">Admin approval is required before opening the private community dashboard.</p></Card>;
  return <Card><h1>{community?.name || "Community"} Dashboard</h1><p className="muted">{community?.description || "Approved community access required."}</p></Card>;
}
