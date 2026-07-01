import { useEffect, useMemo, useState } from "react";
import { Card } from "../../components/ui/Card";
import { ErrorState } from "../../components/ui/ErrorState";
import { LoadingState } from "../../components/ui/LoadingState";
import { getApiError, pageItems } from "../../services/api";
import { EventItem, eventService } from "../../services/event.service";
import { usePrimaryCommunity } from "./hooks";

export function CalendarPage() {
  const { community, loading: communityLoading, error: communityError, reload } = usePrimaryCommunity();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [error, setError] = useState("");
  useEffect(() => {
    if (!community) return;
    eventService.byCommunity(community.id).then((data) => setEvents(pageItems(data))).catch((err) => setError(getApiError(err)));
  }, [community]);
  const days = useMemo(() => Array.from({ length: 31 }, (_, index) => index + 1), []);
  const eventDays = new Set(events.map((event) => new Date(event.startDateTime).getDate()));
  const selectedEvents = events.filter((event) => new Date(event.startDateTime).getDate() === selectedDay);
  if (communityLoading) return <LoadingState />;
  if (communityError || error) return <ErrorState message={communityError || error} onRetry={reload} />;
  return <section><div className="page-head"><h1>Calendar</h1></div><Card><div className="calendar-grid">{days.map((day) => <button type="button" key={day} className={`calendar-day ${eventDays.has(day) ? "has-event" : ""} ${selectedDay === day ? "active" : ""}`} onClick={() => setSelectedDay(day)}><strong>{day}</strong>{eventDays.has(day) && <p className="muted">Event</p>}</button>)}</div></Card><Card style={{ marginTop: 18 }}><h3>Selected date events</h3>{selectedEvents.length ? selectedEvents.map((event) => <p key={event.id}>{event.title} at {new Date(event.startDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>) : <p className="muted">No events on this date.</p>}</Card></section>;
}
