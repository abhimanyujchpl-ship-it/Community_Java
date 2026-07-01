import { EventItem } from "../../services/event.service";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import "./cards.css";

export function EventCard({ event, actions, onView }: { event: EventItem; actions?: React.ReactNode; onView?: () => void }) {
  const date = new Date(event.startDateTime);
  const tone = event.status === "UPCOMING" ? "success" : event.status === "COMPLETED" ? "neutral" : "danger";
  return (
    <Card className="event-card">
      <div className="date-block">
        <span>{date.toLocaleString(undefined, { month: "short" })}</span>
        <strong>{date.getDate()}</strong>
      </div>
      <div className="stack">
        <Badge tone={tone}>{event.status}</Badge>
        <h3>{event.title}</h3>
        <p>{event.description || "Community event"}</p>
        <div className="card-meta">
          <span>{date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          <span>{event.location}</span>
          <span>{event.organizerName || "Community admin"}</span>
        </div>
        <div className="actions">
          <Button type="button" variant="secondary" onClick={onView}>View Details</Button>
          {actions}
        </div>
      </div>
    </Card>
  );
}
