import { useEffect, useState } from "react";
import { NotificationRow } from "../../components/cards/NotificationRow";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { LoadingState } from "../../components/ui/LoadingState";
import { getApiError, pageItems } from "../../services/api";
import { NotificationItem, notificationService } from "../../services/notification.service";

export function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function load() { setLoading(true); try { setItems(pageItems(await notificationService.list())); } catch (err) { setError(getApiError(err)); } finally { setLoading(false); } }
  async function markAll() { await notificationService.markAllRead(); window.dispatchEvent(new Event("notifications-changed")); await load(); }
  async function markOne(id: string) { await notificationService.markRead(id); window.dispatchEvent(new Event("notifications-changed")); await load(); }
  useEffect(() => { void load(); }, []);
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  return <section><div className="page-head"><h1>Notifications</h1><Button type="button" onClick={markAll}>Mark all as read</Button></div><div className="stack">{items.length ? items.map((item) => <NotificationRow key={item.id} item={item} onRead={() => markOne(item.id)} />) : <EmptyState title="No notifications" message="You are all caught up." />}</div></section>;
}
