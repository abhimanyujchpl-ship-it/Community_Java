import { useCallback, useEffect, useState } from "react";
import { getApiError, pageItems } from "../../services/api";
import { Community, communityService } from "../../services/community.service";
import { DashboardData, dashboardService } from "../../services/dashboard.service";
import { getActiveCommunityId, getUser, setActiveCommunityId } from "../../store/auth.store";

export function usePrimaryCommunity() {
  const [community, setCommunity] = useState<Community | null>(null);
  const [approved, setApproved] = useState(false);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await communityService.list();
      const communities = pageItems(data);
      const preferred = communities.find((item) => item.id === getActiveCommunityId()) || communities[0] || null;
      setCommunity(preferred);
      setApproved(false);
      setDashboard(null);
      if (preferred) {
        const user = getUser();
        if (user?.role === "SUPER_ADMIN" || user?.role === "COMMUNITY_ADMIN") {
          setDashboard(await dashboardService.admin(preferred.id));
          setApproved(true);
        } else {
          setDashboard(await dashboardService.member(preferred.id));
          setApproved(true);
        }
        setActiveCommunityId(preferred.id);
      }
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { community, approved, dashboard, loading, error, reload: load };
}
