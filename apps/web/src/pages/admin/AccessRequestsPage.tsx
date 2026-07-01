import { useEffect, useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { LoadingState } from "../../components/ui/LoadingState";
import { Modal } from "../../components/ui/Modal";
import { Textarea } from "../../components/ui/Textarea";
import { getApiError, pageItems } from "../../services/api";
import { AccessRequest, accessRequestService } from "../../services/accessRequest.service";
import { communityService } from "../../services/community.service";

export function AccessRequestsPage() {
  const [items, setItems] = useState<AccessRequest[]>([]);
  const [communityId, setCommunityId] = useState("");
  const [rejecting, setRejecting] = useState<AccessRequest | null>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function load() {
    setLoading(true);
    try {
      const communities = pageItems(await communityService.list());
      const id = communities[0]?.id || "";
      setCommunityId(id);
      if (id) setItems(pageItems(await accessRequestService.byCommunity(id, "PENDING")));
    } catch (err) { setError(getApiError(err)); } finally { setLoading(false); }
  }
  async function approve(id: string) { await accessRequestService.approve(id); await load(); }
  async function reject() { if (!rejecting) return; await accessRequestService.reject(rejecting.id, reason); setRejecting(null); setReason(""); await load(); }
  useEffect(() => { void load(); }, []);
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  return <section><div className="page-head"><h1>Access Requests</h1></div><div className="stack">{items.length ? items.map((item) => <Card key={item.id}><h3>{item.user?.fullName || "Member request"}</h3><p className="muted">{item.user?.email || item.user?.mobile}</p><p>{item.requestMessage}</p><div className="actions"><Button type="button" onClick={() => approve(item.id)}>Approve</Button><Button type="button" variant="danger" onClick={() => setRejecting(item)}>Reject</Button></div></Card>) : <EmptyState title="No pending requests" message={communityId ? "All caught up." : "No community found."} />}</div>{rejecting && <Modal title="Reject request" onClose={() => setRejecting(null)}><div className="form-grid"><Textarea label="Rejection reason" value={reason} onChange={(e) => setReason(e.target.value)} /><Button type="button" variant="danger" onClick={reject}>Reject</Button></div></Modal>}</section>;
}
