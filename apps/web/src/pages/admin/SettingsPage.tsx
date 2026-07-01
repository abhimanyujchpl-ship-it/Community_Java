import { useEffect, useState } from "react";
import { Card } from "../../components/ui/Card";
import { ErrorState } from "../../components/ui/ErrorState";
import { LoadingState } from "../../components/ui/LoadingState";
import { getApiError, pageItems } from "../../services/api";
import { Community, communityService } from "../../services/community.service";

export function SettingsPage() {
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      setCommunity(pageItems(await communityService.list())[0] || null);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <section>
      <div className="page-head"><h1>Settings</h1></div>
      <Card>
        <h3>Community profile</h3>
        <div className="grid grid-2">
          <p><strong>Name:</strong> {community?.name || "Not configured"}</p>
          <p><strong>Status:</strong> {community?.status || "Unknown"}</p>
          <p><strong>Location:</strong> {[community?.city, community?.state].filter(Boolean).join(", ") || "Not set"}</p>
          <p><strong>Members:</strong> {community?.memberCount ?? 0}</p>
        </div>
        <p className="muted">{community?.description || "Community details will appear here once available."}</p>
      </Card>
    </section>
  );
}
