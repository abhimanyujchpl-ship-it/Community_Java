import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CommunityCard } from "../../components/cards/CommunityCard";
import { Button } from "../../components/ui/Button";
import { ErrorState } from "../../components/ui/ErrorState";
import { LoadingState } from "../../components/ui/LoadingState";
import { Modal } from "../../components/ui/Modal";
import { Textarea } from "../../components/ui/Textarea";
import { routes } from "../../constants/routes";
import { getApiError, pageItems } from "../../services/api";
import { accessRequestService, AccessRequest } from "../../services/accessRequest.service";
import { Community, communityService } from "../../services/community.service";
import { getActiveCommunityId, setActiveCommunityId } from "../../store/auth.store";
import "./member.css";

export function CommunitySearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Community | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [communityData, requestData] = await Promise.all([communityService.list(), accessRequestService.my().catch(() => ({ items: [] }))]);
      setCommunities(pageItems(communityData));
      setRequests(pageItems(requestData));
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    return communities.filter((community) => {
      const status = requests.find((request) => request.community?.id === community.id)?.status;
      const matchesText = `${community.name} ${community.description || ""}`.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filter === "All" || filter === "Popular" || status === filter.toUpperCase();
      return matchesText && matchesFilter;
    });
  }, [communities, filter, query, requests]);

  async function submitRequest(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;
    try {
      setSubmitting(true);
      await accessRequestService.create({ communityId: selected.id, requestMessage: message });
      setSuccess("Access request submitted.");
      setSelected(null);
      setMessage("");
      await load();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingState label="Loading communities..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <section>
      <div className="page-head">
        <div><h1>Browse Communities</h1><p className="muted">Search, request access, and open approved community dashboards.</p></div>
      </div>
      <input className="chip" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search communities..." />
      {success && <div className="message success">{success}</div>}
      <div className="filters">
        {["All", "Popular", "Pending", "Approved"].map((item) => (
          <button key={item} className={`chip ${filter === item ? "active" : ""}`} onClick={() => setFilter(item)}>{item}</button>
        ))}
      </div>
      <div className="grid grid-3">
        {filtered.map((community) => {
          const requestStatus = requests.find((request) => request.community?.id === community.id)?.status;
          const status = getActiveCommunityId() === community.id ? "APPROVED" : requestStatus;
          return <CommunityCard key={community.id} community={community} status={status} onRequest={() => setSelected(community)} onOpen={() => { setActiveCommunityId(community.id); navigate(routes.communityDashboard); }} />;
        })}
      </div>
      {selected && (
        <Modal title={`Request access to ${selected.name}`} onClose={() => setSelected(null)}>
          <form className="form-grid" onSubmit={submitRequest}>
            <Textarea label="Request message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell the admin why you want to join." />
            <div className="actions">
              <Button type="submit" disabled={submitting}>{submitting ? "Submitting..." : "Submit request"}</Button>
              <Button type="button" variant="ghost" onClick={() => setSelected(null)}>Cancel</Button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  );
}
