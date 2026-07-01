import { useEffect, useState } from "react";
import { EventCard } from "../../components/cards/EventCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { LoadingState } from "../../components/ui/LoadingState";
import { Modal } from "../../components/ui/Modal";
import { getApiError, pageItems } from "../../services/api";
import { EventItem, eventService } from "../../services/event.service";
import { usePrimaryCommunity } from "./hooks";

export function EventsPage() {
  const { community, loading: communityLoading, error: communityError, reload } = usePrimaryCommunity();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selected, setSelected] = useState<EventItem | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function load() {
    if (!community) return;
    setLoading(true);
    try {
      setEvents(pageItems(status ? await eventService.byCommunity(community.id, status) : await eventService.upcoming(community.id)));
    } catch (err) { setError(getApiError(err)); } finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, [community, status]);
  if (communityLoading) return <LoadingState />;
  if (communityError) return <ErrorState message={communityError} onRetry={reload} />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  return <section><div className="page-head"><h1>Events</h1></div><div className="filters">{["", "UPCOMING", "COMPLETED", "CANCELLED"].map((item) => <button key={item || "ALL"} className={`chip ${status === item ? "active" : ""}`} onClick={() => setStatus(item)}>{item || "All"}</button>)}</div>{loading ? <LoadingState /> : events.length ? <div className="grid grid-2">{events.map((event) => <EventCard key={event.id} event={event} onView={() => setSelected(event)} />)}</div> : <EmptyState title="No events" message="Community events will appear here." />}{selected && <Modal title={selected.title} onClose={() => setSelected(null)}><div className="stack"><p>{selected.description || "No description provided."}</p><p><strong>When:</strong> {new Date(selected.startDateTime).toLocaleString()} - {new Date(selected.endDateTime).toLocaleString()}</p><p><strong>Location:</strong> {selected.location}</p><p><strong>Organizer:</strong> {selected.organizerName || "Community admin"}</p></div></Modal>}</section>;
}
