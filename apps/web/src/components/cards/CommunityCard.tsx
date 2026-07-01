import { Community } from "../../services/community.service";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import "./cards.css";

export function CommunityCard({
  community,
  status,
  onRequest,
  onOpen
}: {
  community: Community;
  status?: string;
  onRequest?: () => void;
  onOpen?: () => void;
}) {
  const badgeTone = status === "APPROVED" ? "success" : status === "PENDING" ? "warning" : "neutral";
  return (
    <Card className="community-card">
      <div className="avatar large">{community.name.slice(0, 1)}</div>
      <div className="stack">
        <div>
          <h3>{community.name}</h3>
          <p>{community.description || "A connected community for members, events, and updates."}</p>
        </div>
        <div className="card-meta">
          <span>{[community.city, community.state].filter(Boolean).join(", ") || "Location available soon"}</span>
          <span>{community.memberCount ?? 0} members</span>
        </div>
        {status && <Badge tone={badgeTone}>{status}</Badge>}
        {status === "APPROVED" ? (
          <Button type="button" onClick={onOpen}>Open Dashboard</Button>
        ) : (
          <Button type="button" onClick={onRequest} disabled={status === "PENDING"}>
            {status === "PENDING" ? "Requested" : "Request Access"}
          </Button>
        )}
      </div>
    </Card>
  );
}
