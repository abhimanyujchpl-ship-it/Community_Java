import { FormEvent, useEffect, useState } from "react";
import { EventCard } from "../../components/cards/EventCard";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { ErrorState } from "../../components/ui/ErrorState";
import { Input } from "../../components/ui/Input";
import { LoadingState } from "../../components/ui/LoadingState";
import { Modal } from "../../components/ui/Modal";
import { Textarea } from "../../components/ui/Textarea";
import { getApiError, pageItems } from "../../services/api";
import { communityService } from "../../services/community.service";
import { EventItem, eventService } from "../../services/event.service";

export function AdminEventsPage() {
  const [communityId, setCommunityId] = useState("");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selected, setSelected] = useState<EventItem | null>(null);
  const [form, setForm] = useState({ title: "", eventType: "MEETING", description: "", location: "", startDateTime: "", endDateTime: "", organizerName: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function load() {
    setLoading(true);
    try {
      const community = pageItems(await communityService.list())[0];
      setCommunityId(community?.id || "");
      setEvents(community ? pageItems(await eventService.byCommunity(community.id)) : []);
    } catch (err) { setError(getApiError(err)); } finally { setLoading(false); }
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (new Date(form.endDateTime) < new Date(form.startDateTime)) { setError("End date cannot be before start date."); return; }
    await eventService.create({ ...form, communityId, startDateTime: new Date(form.startDateTime).toISOString(), endDateTime: new Date(form.endDateTime).toISOString() });
    setForm({ title: "", eventType: "MEETING", description: "", location: "", startDateTime: "", endDateTime: "", organizerName: "" });
    await load();
  }
  useEffect(() => { void load(); }, []);
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  return <section><div className="page-head"><h1>Admin Events</h1></div><Card><form className="form-grid" onSubmit={submit}><Input label="Event title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /><Input label="Event type" value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })} required /><Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /><Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required /><Input label="Start date/time" type="datetime-local" value={form.startDateTime} onChange={(e) => setForm({ ...form, startDateTime: e.target.value })} required /><Input label="End date/time" type="datetime-local" value={form.endDateTime} onChange={(e) => setForm({ ...form, endDateTime: e.target.value })} required /><Input label="Organizer name" value={form.organizerName} onChange={(e) => setForm({ ...form, organizerName: e.target.value })} /><Button type="submit">Create Event</Button></form></Card><div className="grid grid-2" style={{ marginTop: 18 }}>{events.map((item) => <EventCard key={item.id} event={item} onView={() => setSelected(item)} actions={<><Button type="button" variant="ghost" onClick={() => eventService.cancel(item.id).then(load)}>Cancel</Button><Button type="button" variant="ghost" onClick={() => eventService.complete(item.id).then(load)}>Complete</Button></>} />)}</div>{selected && <Modal title={selected.title} onClose={() => setSelected(null)}><div className="stack"><p>{selected.description || "No description provided."}</p><p><strong>When:</strong> {new Date(selected.startDateTime).toLocaleString()} - {new Date(selected.endDateTime).toLocaleString()}</p><p><strong>Location:</strong> {selected.location}</p><p><strong>Status:</strong> {selected.status}</p></div></Modal>}</section>;
}
