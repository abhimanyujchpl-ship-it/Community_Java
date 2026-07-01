import { NotificationItem } from "../../services/notification.service";
import { Button } from "../ui/Button";
import "./cards.css";

export function NotificationRow({ item, onRead }: { item: NotificationItem; onRead?: () => void }) {
  const read = item.isRead ?? item.read;
  return (
    <div className={`notification-row ${read ? "read" : ""}`}>
      <div>
        <strong>{item.title}</strong>
        <p>{item.message}</p>
      </div>
      {!read && <Button type="button" variant="secondary" onClick={onRead}>Mark read</Button>}
    </div>
  );
}
